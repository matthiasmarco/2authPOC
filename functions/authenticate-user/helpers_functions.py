import json
import os
import psycopg2
import pyotp
from cryptography.fernet import Fernet
from datetime import datetime, timedelta, timezone
import re

# Fonction pour générer une réponse avec en-tête JSON
def make_response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body_dict)
    }

# Lecture des secrets
def read_secret(name):
    with open("/var/openfaas/secrets/" + name) as f:
        return f.read().strip()

# Déchiffrement Fernet
def decrypt_secret(token, key):
    f = Fernet(key)
    return f.decrypt(token.encode()).decode()

# Validation du nom d'utilisateur
def validate_username(username):
    username = username.strip()
    if not username:
        return False, "Le champ 'username' est requis."
    if len(username) < 5:
        return False, "Le nom d'utilisateur doit contenir au moins 5 caractères."
    if not all(c.isalnum() or c in ".-_" for c in username):
        return False, "Le nom d'utilisateur contient des caractères invalides."
    return True, ""

# Lecture et parsing du JSON d'entrée
def parse_request_body(event):
    try:
        data = json.loads(event.body)
        return data, None
    except Exception:
        return None, "Le corps de la requête doit être un JSON valide."

# Lecture du délai d'expiration depuis l'env
def get_expiration_timedelta():
    raw = os.getenv("EXPIRATION_DELAY", "180d").strip().lower()
    pattern = r"^(\d+)([smhd])$"
    match = re.match(pattern, raw)

    if not match:
        return timedelta(days=180)

    value, unit = int(match.group(1)), match.group(2)
    if unit == 's': return timedelta(seconds=value)
    if unit == 'm': return timedelta(minutes=value)
    if unit == 'h': return timedelta(hours=value)
    if unit == 'd': return timedelta(days=value)

    return timedelta(days=180)

# Authentification complète de l'utilisateur
def authenticate_user(username, password_input, otp_input, secret_key):
    db_user = read_secret("db-user")
    db_password = read_secret("db-password")
    db_name = os.getenv("DB_NAME")
    db_host = os.getenv("DB_HOST")
    expiration_delay = get_expiration_timedelta()

    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host
    )

    with conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT password, mfa, gendate, mfa_updated_at, expired
                FROM cofrap.users
                WHERE username = %s;
            """, (username,))
            row = cur.fetchone()

            if row is None:
                return 404, {"status": "error", "message": "Utilisateur introuvable."}

            encrypted_pwd, encrypted_mfa, gendate, mfa_date, _ = row

            if gendate is None:
                return 403, {
                    "status": "error",
                    "message": "Identifiants non configurés. Veuillez régénérer votre mot de passe."
                }

            if mfa_date is None:
                return 403, {
                    "status": "error",
                    "message": "Identifiants non configurés. Veuillez régénérer votre 2FA."
                }

            now = datetime.now(timezone.utc)
            gendate = gendate.replace(tzinfo=timezone.utc)
            mfa_date = mfa_date.replace(tzinfo=timezone.utc)

            if not gendate or not mfa_date or \
               now - gendate > expiration_delay or \
               now - mfa_date > expiration_delay:
                cur.execute("UPDATE cofrap.users SET expired = TRUE WHERE username = %s;", (username,))
                return 403, {
                    "status": "expired",
                    "message": "Identifiants expirés. Veuillez régénérer mot de passe et 2FA."
                }

            # Vérification du mot de passe
            decrypted_pwd = decrypt_secret(encrypted_pwd, secret_key)
            if decrypted_pwd != password_input:
                return 401, {"status": "error", "message": "Mot de passe incorrect."}

            # Vérification du TOTP
            decrypted_mfa = decrypt_secret(encrypted_mfa, secret_key)
            totp = pyotp.TOTP(decrypted_mfa)
            if not totp.verify(otp_input):
                return 401, {"status": "error", "message": "Code 2FA invalide."}

            return 200, {"status": "ok", "message": "Authentification réussie"}
    conn.close()