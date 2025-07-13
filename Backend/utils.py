from jose import jwt
from datetime import datetime, timedelta
import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Cloudinary Config
CLOUD_NAME = "dloh7csm6"
UPLOAD_PRESET = "resume_upload"  # ✅ your unsigned preset

cloudinary.config(cloud_name=CLOUD_NAME)

# JWT Token Generator
def generate_token(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    # Use a default secret key if not provided in environment
    secret_key = os.getenv("JWT_SECRET", "your-secret-key-here-change-in-production")
    return jwt.encode(payload, secret_key, algorithm="HS256")

# PDF Upload to Cloudinary (unsigned)
def upload_pdf_to_cloudinary(file):
    try:
        print("📤 Uploading resume to Cloudinary...")

        result = cloudinary.uploader.unsigned_upload(
            file,
            upload_preset=UPLOAD_PRESET,
            resource_type="raw",     # Required for non-image (PDF) uploads
            public_id=None           # Auto-generate unique name
        )

        print("✅ Uploaded:", result["secure_url"])
        return result["secure_url"]

    except Exception as e:
        print("❌ Upload failed:", str(e))
        raise Exception(f"Upload failed: {str(e)}")
