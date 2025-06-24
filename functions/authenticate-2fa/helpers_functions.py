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
def parse_delay(value, default_seconds):
    pattern = r"^(\\d+)([smhd])$"
    match = re.match(pattern, value.strip().lower())
    if not match:
        return timedelta(seconds=default_seconds)
    num, unit = int(match.group(1)), match.group(2)
    if unit == 's': return timedelta(seconds=num)
    if unit == 'm': return timedelta(minutes=num)
    if unit == 'h': return timedelta(hours=num)
    if unit == 'd': return timedelta(days=num)
    return timedelta(seconds=default_seconds)

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
def authenticate_2fa(username, otp_input, secret_key):
    db_user = read_secret("db-user")
    db_password = read_secret("db-password")
    db_name = os.getenv("DB_NAME")
    db_host = os.getenv("DB_HOST")

    expiration_delay = get_expiration_timedelta()
    
    min_delay = parse_delay(os.getenv("MIN_DELAY_BETWEEN_STEPS", "5s"), 5)
    max_delay = parse_delay(os.getenv("MAX_DELAY_BETWEEN_STEPS", "5m"), 300)

    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host
    )

    with conn:
        with conn.cursor() as cur:
            cur.execute("SELECT mfa, mfa_updated_at, password, gendate, last_password_ok_at, expired, disabled FROM cofrap.users WHERE username = %s;", (username,))
            row = cur.fetchone()

            if not row:
                return 404, {"status": "error", "message": "Utilisateur introuvable."}

            encrypted_mfa, mfa_date, encrypt_password, gendate, last_ok, expired, disabled = row

            if disabled:
                return 403, {"status": "disabled", "message": "Compte désactivé."}

            if gendate is None or encrypt_password is None:
                return 403, {"status": "error", "message": "Identifiants non configurés. Veuillez régénérer votre mot de passe."}
            
            if mfa_date is None or encrypted_mfa is None:
                return 403, {"status": "error", "message": "Identifiants non configurés. Veuillez régénérer votre 2FA."}

            if expired:
                return 403, {
                    "status": "expired",
                    "message": "Identifiants expirés. Veuillez régénérer mot de passe et 2FA."
                }
            
            if last_ok is None:
                return 403, {"status": "error", "message": "Étape mot de passe non validée."}
            

            # Vérification de l'expiration des identifiants
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

            # Vérification du délai entre les étapes
            last_ok = last_ok.replace(tzinfo=timezone.utc)
            if now - last_ok < min_delay:
                return 403, {"status": "error", "message": "Veuillez attendre quelques secondes avant de saisir le code 2FA."}
            if now - last_ok > max_delay:
                return 403, {"status": "error", "message": "Session expirée. Veuillez recommencer l’authentification."}

            # Vérification du mot de passe
            decrypted_mfa = decrypt_secret(encrypted_mfa, secret_key)
            totp = pyotp.TOTP(decrypted_mfa)
            if not totp.verify(otp_input):
                return 401, {"status": "error", "message": "Code 2FA invalide."}

            return 200, {"status": "ok", "message": "Authentification réussie."}
    conn.close()