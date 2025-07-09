from fastapi import APIRouter, HTTPException, Query
from database import resume_collection
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter()

def serialize_resume(doc):
    return {
        "id": str(doc.get("_id")),
        "email": doc.get("email"),
        "resumeUrl": doc.get("resumeUrl"),
        "aiFeedback": doc.get("aiFeedback", ""),
        "scores": doc.get("scores", {
            "skillScore": None,
            "tfidfScore": None,
            "bertScore": None,
            "hybridScore": None
        }),
        "uploadedAt": doc.get("uploadedAt", datetime.utcnow()).isoformat()
    }

@router.get("/get-resumes")
def get_resumes_for_email(email: str = Query(..., description="User email to fetch resumes")):
    try:
        # Sort by scores.hybridScore descending (highest first)
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
