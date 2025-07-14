import spacy
import requests
from io import BytesIO
import fitz  # PyMuPDF
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️ spaCy model not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

# Load BERT model
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Extract text from PDF URL
def extract_text_from_url(pdf_url):
    try:
        response = requests.get(pdf_url, timeout=30)
        if response.status_code != 200:
            raise Exception(f"Failed to download PDF: HTTP {response.status_code}")
        
        pdf_stream = BytesIO(response.content)
        doc = fitz.open(stream=pdf_stream, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc)
        
        if not text.strip():
            raise Exception("PDF appears to be empty or unreadable")
            
        return text
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

# Extract skills from text
def extract_skills(text, skill_keywords):
    if not nlp:
        text_lower = text.lower()
        return {skill for skill in skill_keywords if skill.lower() in text_lower}
    
    try:
        doc = nlp(text.lower())
        return {token.text for token in doc if token.text in skill_keywords}
    except Exception as e:
        print(f"⚠️ Error in skill extraction: {e}")
        text_lower = text.lower()
        return {skill for skill in skill_keywords if skill.lower() in text_lower}

# TF-IDF similarity
def tfidf_similarity(text1, text2):
    try:
        if not text1.strip() or not text2.strip():
            return 0.0
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([text1, text2])
        cosine_sim = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        return cosine_sim * 100
    except Exception as e:
        print(f"⚠️ Error in TF-IDF similarity: {e}")
        return 0.0

# BERT-based semantic similarity
def bert_similarity(text1, text2):
    try:
        if not text1.strip() or not text2.strip():
            return 0.0
        embeddings = bert_model.encode([text1, text2], convert_to_tensor=True)
        similarity = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item()
        return similarity * 100
    except Exception as e:
        print(f"⚠️ Error in BERT similarity: {e}")
        return 0.0

# Skill match score
def skill_match_score(resume_skills, jd_skills):
    try:
        if not jd_skills:
            return 0
        matched = resume_skills & jd_skills
        return (len(matched) / len(jd_skills)) * 100
    except Exception as e:
        print(f"⚠️ Error in skill match scoring: {e}")
        return 0.0

# Hybrid score using BERT instead of simple similarity
def hybrid_score(skill_score, tfidf_score, bert_score, weights=(0.4, 0.3, 0.3)):
    try:
        return round(weights[0]*skill_score + weights[1]*tfidf_score + weights[2]*bert_score, 2)
    except Exception as e:
        print(f"⚠️ Error in hybrid scoring: {e}")
        return 0.0

# Predefined skill keywords (shortened here for brevity; use full list in production)
skill_keywords = {
    "python", "java", "c++", "sql", "react", "node.js", "django", "flask", "html", "css",
    "tensorflow", "keras", "pytorch", "mongodb", "git", "docker", "aws", "azure", "linux",
    "communication", "leadership", "problem solving", "teamwork"
}

# 🔍 Main analysis function
def analyze_resume_against_jd(resume_url, jd_text):
    try:
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
    except Exception as e:
        print(f"❌ Error in resume analysis: {str(e)}")
        return {
            "resumeSkills": [],
            "jdSkills": [],
            "matchedSkills": [],
            "missingSkills": [],
            "skillScore": 0.0,
            "tfidfScore": 0.0,
            "bertScore": 0.0,
            "hybridScore": 0.0
        }
