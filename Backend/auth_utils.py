from fastapi import Request, HTTPException
from jose import jwt, JWTError
from bson import ObjectId
import os
from database import collection  # your user collection

def get_current_user(request: Request):
    token = request.cookies.get("jwt")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        user_id = payload.get("user_id")

        user = collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "_id": str(user["_id"]),
            "fullName": user["fullName"],
            "email": user["email"]
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
