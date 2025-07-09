# uploads.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from bson import ObjectId
from database import resume_collection
from utils import upload_pdf_to_cloudinary
from calculation import analyze_resume_against_jd
from ai_feedback import generate_feedback
from datetime import datetime
from auth_utils import get_current_user

router = APIRouter()

@router.post("/upload-resume-analyze")
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    jd_text: str = Form(...),
    user=Depends(get_current_user),
):
    # 1. Validate PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        # 2. Upload to Cloudinary
        resume_url = upload_pdf_to_cloudinary(file.file)

        # 3. Insert initial document
        resume_doc = {
            "email": user["email"],
            "resumeUrl": resume_url,
            "aiFeedback": "",
            "scores": {
                "skillScore": None,
                "tfidfScore": None,
                "bertScore": None,
                "hybridScore": None,
            },
            "uploadedAt": datetime.utcnow(),
        }
        result = resume_collection.insert_one(resume_doc)
        resume_id = str(result.inserted_id)

        # 4. Analyze the resume against the JD
        analysis = analyze_resume_against_jd(resume_url, jd_text)
        # ensure analysis includes the raw text for feedback
        resume_text = analysis.get("resumeText", "")

        # 5. Generate AI feedback
        feedback = generate_feedback(
            jd=jd_text,
            resume_text=resume_text,
            matched_skills=", ".join(analysis["matchedSkills"]),
            # convert back to decimal for prompt if needed
            tfidf_score=analysis["tfidfScore"] / 100,
            bert_score=analysis["bertScore"] / 100,
            hybrid_score=analysis["hybridScore"] / 100,
        )
        analysis["aiFeedback"] = feedback

        # 6. Update document with scores & feedback
        resume_collection.update_one(
            {"_id": ObjectId(resume_id)},
            {"$set": {
                "scores.skillScore": analysis["skillScore"],
                "scores.tfidfScore": analysis["tfidfScore"],
                "scores.bertScore": analysis["bertScore"],
                "scores.hybridScore": analysis["hybridScore"],
                "aiFeedback": feedback,
            }},
        )

        # 7. Return combined response
        return {
            "message": "Resume uploaded and analyzed successfully",
            "resumeId": resume_id,
            "resumeUrl": resume_url,
            **analysis
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
