# uploads.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from bson import ObjectId
from database import resume_collection
from utils import upload_pdf_to_cloudinary
from calculation import extract_text_from_url, analyze_resume_against_jd
from ai_feedback import generate_feedback
from datetime import datetime
from auth_utils import get_current_user
import os
from fastapi.responses import JSONResponse

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


@router.post("/guest-analyze")
def analyze_guest_resume():
    try:
        resume_url = "https://res.cloudinary.com/dloh7csm6/raw/upload/v1752328644/bbaexcathzjznjeixvo5.pdf"

        # 3. Hardcoded JD
        jd_text = """
        We are looking for a versatile full-stack developer with strong experience in the MERN stack (MongoDB, Express.js, React, Node.js) 
        along with solid programming skills in Python, Java, and C++. The ideal candidate should be proficient in building RESTful APIs, 
        working with SQL and NoSQL databases, and designing scalable backend systems. Experience in machine learning, data science, and 
        related Python libraries such as pandas, scikit-learn, and TensorFlow is highly desirable. Familiarity with data structures, 
        algorithms, and cloud platforms (e.g., AWS) is a plus. Strong problem-solving skills and the ability to work in cross-functional teams are essential.
        """

        # 4. Analyze using Cloudinary URL
        analysis = analyze_resume_against_jd(resume_url=resume_url, jd_text=jd_text)
        resume_text = analysis.get("resumeText", "")  # Ensure for feedback

        # 5. Generate AI feedback
        feedback = generate_feedback(
            jd=jd_text,
            resume_text=resume_text,
            matched_skills=", ".join(analysis["matchedSkills"]),
            tfidf_score=analysis["tfidfScore"] / 100,
            bert_score=analysis["bertScore"] / 100,
            hybrid_score=analysis["hybridScore"] / 100,
        )
        analysis["aiFeedback"] = feedback

        return {
            "message": "Guest resume analyzed successfully",
            "resumeUrl": resume_url,
            **analysis
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing guest resume: {str(e)}")