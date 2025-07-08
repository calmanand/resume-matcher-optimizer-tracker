from jose import jwt
import os
from datetime import datetime, timedelta

def generate_token(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")