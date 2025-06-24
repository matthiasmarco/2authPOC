from .helpers_functions import (
    make_response,
    read_secret,
    validate_username,
    parse_request_body,
    authenticate_password,
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
        password_input = data.get("password", "").strip()

        is_valid, validation_msg = validate_username(username)
        if not is_valid or not password_input:
            return make_response(
                400,
                {
                    "status": "error",
                    "message": validation_msg or "Champs 'username' et 'password' requis."
                }
            )

        # Authentification du mot de passe
        status_code, result = authenticate_password(username, password_input, secret_key)
        return make_response(
            status_code,
            result
        )

    except Exception as e:
        return make_response(
            500,
            {"status": "error", "message": str(e)}
        )
