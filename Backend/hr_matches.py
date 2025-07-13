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
            return {
                "message": "No resumes available in database",
                "jd": jd_text,
                "count": 0,
                "topResumes": []
            }

        scored_resumes = []
        processed_count = 0

        for resume in resumes:
            try:
                resume_url = resume.get("resumeUrl")
                if not resume_url:
                    print(f"⚠️ Skipping resume {resume.get('_id')}: No URL found")
                    continue

                # Analyze match between HR JD and current resume
                analysis = analyze_resume_against_jd(resume_url=resume_url, jd_text=jd_text)

                scored_resumes.append({
                    "resumeId": str(resume["_id"]),
                    "email": resume.get("email", "Unknown"),
                    "resumeUrl": resume_url,
                    "matchedSkills": analysis.get("matchedSkills", []),
                    "scores": {
                        "skillScore": analysis.get("skillScore", 0),
                        "tfidfScore": analysis.get("tfidfScore", 0),
                        "bertScore": analysis.get("bertScore", 0),
                        "hybridScore": analysis.get("hybridScore", 0)
                    }
                })
                processed_count += 1

            except Exception as e:
                print(f"⚠️ Skipping resume {resume.get('_id')}: {e}")
                continue

        if not scored_resumes:
            return {
                "message": "No valid resumes could be processed",
                "jd": jd_text,
                "count": 0,
                "topResumes": []
            }

        # Sort by hybrid score and get top 10
        top_resumes = sorted(scored_resumes, key=lambda x: x["scores"]["hybridScore"], reverse=True)[:10]

        return {
            "message": f"Top matching resumes retrieved (processed {processed_count} resumes)",
            "jd": jd_text,
            "count": len(top_resumes),
            "topResumes": top_resumes
        }

    except Exception as e:
        print(f"❌ Error in HR matches: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error matching resumes: {str(e)}")
