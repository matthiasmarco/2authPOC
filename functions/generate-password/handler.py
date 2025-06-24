import json
import os
from cryptography.fernet import Fernet
from datetime import datetime, timezone
from .helpers_functions import (
    make_response,
    parse_request_body,
    validate_username,
    read_secret,
    generate_password,
    encrypt_secret,
    generate_qr_logo_base64,
    upsert_user_to_db
)

# Fonction principale pour gérer la requête
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

        # Génération mot de passe
        raw_password = generate_password()
        qr_code = generate_qr_logo_base64(raw_password, logo_path="password.png", color="orange")

        # Chiffrement
        encrypted_pwd = encrypt_secret(raw_password, secret_key)

        # Insertion/mise à jour DB
        upsert_user_to_db(username, encrypted_pwd)

        return make_response(200, {
            "status": "ok",
            "username": username,
            "password_qrcode": qr_code
        })

    except Exception as e:
        return make_response(500, {
            "status": "error",
            "message": str(e)
        })