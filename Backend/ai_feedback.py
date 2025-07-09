# ai_feedback.py
from langchain_google_genai import ChatGoogleGenerativeAI
import os

# instantiate once
_model = ChatGoogleGenerativeAI(model=os.getenv("GENAI_MODEL", "gemini-2.5-flash"))

def generate_feedback(jd: str, resume_text: str, matched_skills: str,
                      tfidf_score: float, bert_score: float, hybrid_score: float) -> str:
    prompt = f"""
You are an expert AI resume reviewer.

## JD:
{jd}

## Resume:
{resume_text}

## Matching:
Skills: {matched_skills}
TF-IDF: {tfidf_score}, BERT: {bert_score}, Hybrid: {hybrid_score}

Give feedback in 4 concise bullet points:
1. Missing Skills
2. Project Phrasing
3. Action Verbs & Metrics
4. Match Summary
"""
    result = _model.invoke(prompt)
    return result.content