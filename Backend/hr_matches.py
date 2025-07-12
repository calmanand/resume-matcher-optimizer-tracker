# hr_matches.py
from fastapi import APIRouter, Form, HTTPException
from database import resume_collection
from calculation import extract_text_from_url, analyze_resume_against_jd
from bson import ObjectId

router = APIRouter()

@router.post("/top-matches")
async def get_top_matching_resumes(jd_text: str = Form(...)):
    try:
        # Fetch all stored resumes
        resumes = list(resume_collection.find({}, {"resumeUrl": 1, "email": 1, "_id": 1}))
        if not resumes:
            raise HTTPException(status_code=404, detail="No resumes available in database.")

        scored_resumes = []

        for resume in resumes:
            try:
                resume_url = resume["resumeUrl"]

                # Analyze match between HR JD and current resume
                analysis = analyze_resume_against_jd(resume_url=resume_url, jd_text=jd_text)

                scored_resumes.append({
                    "resumeId": str(resume["_id"]),
                    "email": resume["email"],
                    "resumeUrl": resume_url,
                    "matchedSkills": analysis["matchedSkills"],
                    "scores": {
                        "skillScore": analysis["skillScore"],
                        "tfidfScore": analysis["tfidfScore"],
                        "bertScore": analysis["bertScore"],
                        "hybridScore": analysis["hybridScore"]
                    }
                })

            except Exception as e:
                print(f"⚠️ Skipping resume {resume.get('_id')}: {e}")
                continue

        top_resumes = sorted(scored_resumes, key=lambda x: x["scores"]["hybridScore"], reverse=True)[:10]

        return {
            "message": "Top matching resumes retrieved",
            "jd": jd_text,
            "count": len(top_resumes),
            "topResumes": top_resumes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching resumes: {str(e)}")
