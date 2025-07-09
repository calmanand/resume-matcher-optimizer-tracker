from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Request
from bson import ObjectId
from utils import upload_pdf_to_cloudinary
from database import resume_collection
from calculation import analyze_resume_against_jd
from datetime import datetime
from auth_utils import get_current_user  # ✅ import the auth dependency

router = APIRouter()

@router.post("/upload-resume-analyze")
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    jd_text: str = Form(...),
    user=Depends(get_current_user)  # ✅ restrict to logged-in users only
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        # 1. Upload to Cloudinary
        resume_url = upload_pdf_to_cloudinary(file.file)

        # 2. Save basic document to MongoDB
        resume_doc = {
            "email": user["email"],  # ✅ Secure: use email from JWT
            "resumeUrl": resume_url,
            "aiFeedback": "",
            "scores": {
                "skillScore": None,
                "tfidfScore": None,
                "bertScore": None,
                "hybridScore": None,
            },
            "uploadedAt": datetime.utcnow()
        }

        result = resume_collection.insert_one(resume_doc)
        resume_id = str(result.inserted_id)

        # 3. Analyze resume against JD
        analysis = analyze_resume_against_jd(resume_url, jd_text)

        # 4. Update document with scores and feedback
        resume_collection.update_one(
            {"_id": ObjectId(resume_id)},
            {"$set": {
                "scores.skillScore": analysis.get("skillScore"),
                "scores.tfidfScore": analysis.get("tfidfScore"),
                "scores.bertScore": analysis.get("bertScore"),
                "scores.hybridScore": analysis.get("hybridScore"),
                "aiFeedback": analysis.get("aiFeedback", "")
            }}
        )

        return {
            "message": "Resume uploaded and analyzed successfully",
            "resumeId": resume_id,
            "resumeUrl": resume_url,
            **analysis
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
