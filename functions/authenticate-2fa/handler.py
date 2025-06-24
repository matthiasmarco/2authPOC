from .helpers_functions import (
    make_response,
    read_secret,
    validate_username,
    parse_request_body,
    authenticate_2fa,
)

# Fonction principale
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

        # Récupération et validation des champs requis
        username = data.get("username", "").strip()
        otp_input = data.get("otp", "").strip()

        is_valid, validation_msg = validate_username(username)
        if not is_valid or not otp_input:
            return make_response(
                400,
                {
                    "status": "error",
                    "message": validation_msg or "Champs 'username' et 'otp' requis."
                }
            )

        # Authentification du mot de passe
        status_code, result = authenticate_2fa(username, otp_input, secret_key)
        return make_response(
            status_code,
            result
        )

    except Exception as e:
        return make_response(
            500,
            {"status": "error", "message": str(e)}
        )
