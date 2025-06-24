import json
import os
import psycopg2
import qrcode
import base64
import io
import string
import random
from cryptography.fernet import Fernet
from datetime import datetime, timezone
from PIL import Image

# Fonction pour générer une réponse avec en-tête JSON
def make_response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body_dict)
    }

# Lecture et parsing du JSON d'entrée
def parse_request_body(event):
    try:
        data = json.loads(event.body)
        return data, None
    except Exception:
        return None, "Le corps de la requête doit être un JSON valide."

# Fonction pour générer un mot de passe aléatoire
def generate_password(length=24):
    charset = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.SystemRandom().choice(charset) for _ in range(length))

# Fonction pour chiffrer un secret avec une clé
def encrypt_secret(secret, key):
    f = Fernet(key)
    return f.encrypt(secret.encode()).decode()

# Fonction pour générer un QR code avec logo en base64
def generate_qr_logo_base64(content, logo_path="password.png", color ="black"):
    path = os.path.join(os.path.dirname(__file__), logo_path)
    password_logo = Image.open(path)

    # Resize the logo to fit in the QR code
    basewidth = 125
    wpercent = basewidth / float(password_logo.size[0])
    hsize = int(float(password_logo.size[1]) * wpercent)
    password_logo = password_logo.resize((basewidth, hsize), Image.LANCZOS)

    qrcode_instance = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)
    qrcode_instance.add_data(content)
    qrcode_instance.make()

    qr_img = qrcode_instance.make_image(fill_color=color, back_color="white").convert('RGBA')

    pos = ((qr_img.size[0] - password_logo.size[0]) // 2, (qr_img.size[1] - password_logo.size[1]) // 2)

    qr_img.paste(password_logo, pos, mask=password_logo)

    # Convert to base64
    buffered = io.BytesIO()
    qr_img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()

    return img_base64

# Fonction pour générer un QR code en base64
def generate_qr_base64(content):
    img = qrcode.make(content)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

# Fonction pour lire un secret depuis le système de fichiers
def read_secret(name):
    with open("/var/openfaas/secrets/" + name) as f:
        return f.read().strip()

# Fonction pour insérer ou mettre à jour un utilisateur dans la base de données
def upsert_user_to_db(username, encrypted_pwd):
    db_user = read_secret("db-user")
    db_password = read_secret("db-password")
    db_name = os.getenv("DB_NAME")
    db_host = os.getenv("DB_HOST")

    gendate = datetime.now(timezone.utc)

    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host
    )   

    with conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO cofrap.users (username, password, mfa, gendate, expired)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (username) DO UPDATE
                SET password = EXCLUDED.password,
                    mfa = NULL,
                    gendate = EXCLUDED.gendate,
                    expired = FALSE,
                    last_password_ok_at = NULL;
            """, (username, encrypted_pwd, None, gendate, False))
    conn.close()

# Fonction pour valider le nom d'utilisateur
def validate_username(username):
    username = username.strip()

    if not username:
        return False, "Le champ 'username' est requis."

    if len(username) < 5:
        return False, "Le nom d'utilisateur doit contenir au moins 5 caractères."

    if not all(c.isalnum() or c in ".-_" for c in username):
        return False, "Le nom d'utilisateur contient des caractères invalides (autorisés: lettres, chiffres, ., -, _)."

    return True, ""
