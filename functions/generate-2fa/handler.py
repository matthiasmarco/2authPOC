import json
from .helpers_functions import (
    make_response,
    parse_request_body,
    read_secret,
    generate_2fa_secret,
    generate_qr_code_2fa,
    encrypt_secret,
    upsert_mfa_to_db,
    validate_username
)

## Fonction principale pour gérer la requête
def handle(event, context):
    try:
        # Lecture de la clé secrète
        secret_key = read_secret("secret-key")
        data, json_error = parse_request_body(event)

        if json_error:
            return make_response(
                400,
                {"status": "error", "message": json_error}
            )

        # Récupération et validation du nom d'utilisateur
        username = data.get("username", "").strip()
        is_valid, error_message = validate_username(username)
        if not is_valid:
            return make_response(400, {
                "status": "error",
                "message": error_message
            })

        # 1. Génération du secret 2FA
        raw_secret = generate_2fa_secret()
        qr_code = generate_qr_code_2fa(raw_secret, username)

        # 2. Chiffrement
        encrypted_secret = encrypt_secret(raw_secret, secret_key)

        # 3. Mise à jour en base
        try:
            upsert_mfa_to_db(username, encrypted_secret)
        except ValueError as ve:
            return make_response(404, {
                "status": "error",
                "message": str(ve)
            })

        # 4. Réponse
        return make_response(200, {
            "status": "ok",
            "username": username,
            "mfa_qrcode": qr_code
        })

    except Exception as e:
        return make_response(500, {
            "status": "error",
            "message": str(e)
        })
