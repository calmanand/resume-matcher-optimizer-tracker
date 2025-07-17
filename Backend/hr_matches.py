from fastapi import APIRouter, Form, HTTPException
from database import resume_collection
from calculation import extract_text_from_url, analyze_resume_against_jd
from bson import ObjectId

router = APIRouter()

@router.post("/top-matches")
async def get_top_matching_resumes(jd_text: str = Form(...)):
    try:
        resumes = list(resume_collection.find({}, {
            "resumeUrl": 1,
            "email": 1,
            "driveUrl": 1,   # <-- Include this
            "_id": 1
        }))
        if not resumes:
            raise HTTPException(status_code=404, detail="No resumes available in database.")

        email_to_best_resume = {}

        for resume in resumes:
            try:
                resume_url = resume["resumeUrl"]
                email = resume["email"]
                drive_url = resume.get("driveUrl", "")

                # Analyze resume against JD
                analysis = analyze_resume_against_jd(resume_url=resume_url, jd_text=jd_text)

                current_resume_data = {
                    "resumeId": str(resume["_id"]),
                    "email": email,
                    "resumeUrl": resume_url,  # Still needed for internal use
                    "driveUrl": drive_url,    # Now included for frontend
                    "matchedSkills": analysis["matchedSkills"],
                    "scores": {
                        "skillScore": analysis["skillScore"],
                        "tfidfScore": analysis["tfidfScore"],
                        "bertScore": analysis["bertScore"],
                        "hybridScore": analysis["hybridScore"]
                    }
                }

                if email not in email_to_best_resume or \
                   analysis["hybridScore"] > email_to_best_resume[email]["scores"]["hybridScore"]:
                    email_to_best_resume[email] = current_resume_data

            except Exception as e:
                print(f"⚠️ Skipping resume {resume.get('_id')}: {e}")
                continue

        top_resumes = sorted(email_to_best_resume.values(), key=lambda x: x["scores"]["hybridScore"], reverse=True)[:10]

        return {
            "message": "Top matching resumes retrieved",
            "jd": jd_text,
            "count": len(top_resumes),
            "topResumes": top_resumes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching resumes: {str(e)}")
