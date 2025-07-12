from fastapi import APIRouter, HTTPException, Query
from database import resume_collection
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter()

def serialize_resume(doc):
    feedback = doc.get("aiFeedback", "")
    
    # Ensure feedback is a list of clean lines
    if isinstance(feedback, str):
        feedback = [line.strip() for line in feedback.split("\n") if line.strip()]

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
