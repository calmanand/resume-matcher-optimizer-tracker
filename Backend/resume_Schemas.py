from datetime import datetime

def create_resume_document(email:str, resume_url:str):
    return {
            "email":email,
            "resumeUrl":resume_url,
            "aiFeedback":"",
            "scores":{
                "skillScore":None,
                "tfidfScore":None,
                "bertScore":None,
                "hybridScore":None,
                },
            "uploadedAt":datetime.utcnow()
            }

