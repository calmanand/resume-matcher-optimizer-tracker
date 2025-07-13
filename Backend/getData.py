from fastapi import APIRouter, HTTPException, Query, Request, Depends
from database import resume_collection
from datetime import datetime
from bson import ObjectId
from typing import List
from jose import JWTError, jwt
import os

router = APIRouter()

def serialize_resume(doc):
    feedback = doc.get("aiFeedback", "")
    
    # Handle different feedback formats
    if isinstance(feedback, dict) and "feedback" in feedback:
        # New format: object with feedback array
        feedback = feedback["feedback"]
    elif isinstance(feedback, str):
        # String format: split into lines
        feedback = [line.strip() for line in feedback.split("\n") if line.strip()]
    elif isinstance(feedback, list):
        # Already a list
        feedback = feedback
    else:
        # Fallback to empty list
        feedback = []

    return {
        "id": str(doc.get("_id")),
        "email": doc.get("email"),
        "resumeUrl": doc.get("resumeUrl"),
        "driveUrl": doc.get("driveUrl"),  # ✅ Include drive link
        "aiFeedback": feedback,
        "scores": doc.get("scores", {
            "skillScore": None,
            "tfidfScore": None,
            "bertScore": None,
            "hybridScore": None
        }),
        "uploadedAt": doc.get("uploadedAt", datetime.utcnow()).isoformat()
    }

@router.get("/")
def get_resumes_for_email(email: str = Query(..., description="User email to fetch resumes")):
    try:
        resumes_cursor = resume_collection.find({"email": email}).sort("scores.hybridScore", -1)
        resumes = list(resumes_cursor)

        if not resumes:
            raise HTTPException(status_code=404, detail="No resumes found for this email.")

        return {
            "email": email,
            "count": len(resumes),
            "resumes": [serialize_resume(resume) for resume in resumes]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching resumes: {str(e)}")

@router.get("/resumes")
def get_resumes_for_authenticated_user(request: Request):
    token = request.cookies.get("jwt")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        secret_key = os.getenv("JWT_SECRET", "your-secret-key-here-change-in-production")
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        # Find user email by user_id
        from database import collection
        user = collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        email = user["email"]
        resumes_cursor = resume_collection.find({"email": email}).sort("scores.hybridScore", -1)
        resumes = list(resumes_cursor)
        return {
            "email": email,
            "count": len(resumes),
            "resumes": [serialize_resume(resume) for resume in resumes]
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching resumes: {str(e)}")
