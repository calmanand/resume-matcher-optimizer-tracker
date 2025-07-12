from langchain_google_genai import ChatGoogleGenerativeAI
import os

# instantiate once
_model = ChatGoogleGenerativeAI(model=os.getenv("GENAI_MODEL", "gemini-2.5-flash"))

def generate_feedback(jd: str, resume_text: str, matched_skills: str,
                      tfidf_score: float, bert_score: float, hybrid_score: float) -> str:
    prompt = f"""
You are an expert AI resume reviewer helping job seekers improve their resumes.

## Job Description (JD):
{jd}

## Resume Content:
{resume_text}

## Matching Insights:
- Matched Skills: {matched_skills}
- Overall Match Score: {hybrid_score} (internal use only)

Please write a short feedback (4 to 6 lines) covering the following:
- Mention any important skills missing from the resume (from the JD)
- Comment on whether the resume demonstrates enough project experience or relevant action
- If writing or phrasing is weak, suggest improvement
- Conclude with a general statement about the resume's overall alignment with the job, using simple language
- Avoid any mention of scores like TF-IDF, BERT, or Hybrid — just explain what needs improvement in a way the candidate can understand

Avoid formatting like bullet points, bold text, or headings.
Respond in plain text. Do not repeat the same ideas.
"""
    result = _model.invoke(prompt)
    return result.content
