import spacy
import requests
from io import BytesIO
import fitz  # PyMuPDF
from sklearn.feature_extraction.text import TfidfVectorizer
from sentence_transformers import SentenceTransformer, util

# Load NLP models
nlp = spacy.load("en_core_web_sm")
bert_model = SentenceTransformer("all-MiniLM-L6-v2")

# Download and extract PDF text
def extract_text_from_url(pdf_url):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        raise Exception("❌ Failed to download PDF")
    pdf_stream = BytesIO(response.content)
    doc = fitz.open(stream=pdf_stream, filetype="pdf")
    return "\n".join(page.get_text() for page in doc)

# Skill extractor
def extract_skills(text, skill_keywords):
    doc = nlp(text.lower())
    return {token.text for token in doc if token.text in skill_keywords}

# TF-IDF similarity
def tfidf_similarity(text1, text2):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([text1, text2])
    # (vectors[0] @ vectors[1].T) is a 1×1 sparse matrix; convert it to dense
    cosine_sim = (vectors[0] @ vectors[1].T).toarray()[0][0]
    return cosine_sim * 100

# BERT similarity
def bert_similarity(text1, text2):
    emb1 = bert_model.encode(text1, convert_to_tensor=True)
    emb2 = bert_model.encode(text2, convert_to_tensor=True)
    score = util.cos_sim(emb1, emb2)
    return float(score[0][0]) * 100

# Skill match scoring
def skill_match_score(resume_skills, jd_skills):
    if not jd_skills:
        return 0
    matched = resume_skills & jd_skills
    return (len(matched) / len(jd_skills)) * 100

# Final hybrid score
def hybrid_score(skill_score, tfidf_score, bert_score, weights=(0.4, 0.3, 0.3)):
    return round(weights[0]*skill_score + weights[1]*tfidf_score + weights[2]*bert_score, 2)

# Keywords used for skill extraction
skill_keywords = {
    "python", "java", "c", "c++", "c#", "javascript", "typescript", "ruby", "go", "rust", "bash", "shell",
    "numpy", "pandas", "matplotlib", "scikit-learn", "tensorflow", "keras", "seaborn", "excel", "sql",
    "html", "css", "tailwind css", "react", "angular", "vue", "express", "node.js", "next.js", "mongo", "mongodb",
    "django", "flask", "fastapi", "rest", "restful api", "graphql", "axios", "mongoose",
    "git", "github", "postman", "linux", "wsl", "docker", "kubernetes", "vim", "vs code", "firebase", "aws", "azure",
    "tcp/ip", "udp", "arp", "routing", "osi model", "bgp", "md5", "multicast", "http", "dns", "ip addressing",
    "socket.io", "cloudinary", "fuse.js", "jira", "figma", "power bi", "tableau",
    "communication", "leadership", "problem solving", "teamwork", "analytical thinking"
}

# 🎯 Final function you call
def analyze_resume_against_jd(resume_url, jd_text):
    resume_text = extract_text_from_url(resume_url)
    resume_skills = extract_skills(resume_text, skill_keywords)
    jd_skills = extract_skills(jd_text, skill_keywords)

    skill_score = skill_match_score(resume_skills, jd_skills)
    tfidf_score = tfidf_similarity(resume_text, jd_text)
    bert_score = bert_similarity(resume_text, jd_text)
    final_score = hybrid_score(skill_score, tfidf_score, bert_score)

    return {
        "resumeSkills": sorted(resume_skills),
        "jdSkills": sorted(jd_skills),
        "matchedSkills": sorted(resume_skills & jd_skills),
        "missingSkills": sorted(jd_skills - resume_skills),
        "skillScore": round(skill_score, 2),
        "tfidfScore": round(tfidf_score, 2),
        "bertScore": round(bert_score, 2),
        "hybridScore": final_score
    }
