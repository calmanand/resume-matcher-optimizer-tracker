import spacy
import requests
from io import BytesIO
import fitz  # PyMuPDF
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load NLP models
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️ spaCy model not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

# Download and extract PDF text
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

# Skill extractor
def extract_skills(text, skill_keywords):
    if not nlp:
        # Fallback to simple word matching if spaCy is not available
        text_lower = text.lower()
        return {skill for skill in skill_keywords if skill.lower() in text_lower}
    
    try:
        doc = nlp(text.lower())
        return {token.text for token in doc if token.text in skill_keywords}
    except Exception as e:
        print(f"⚠️ Error in skill extraction: {e}")
        # Fallback to simple word matching
        text_lower = text.lower()
        return {skill for skill in skill_keywords if skill.lower() in text_lower}

# TF-IDF similarity
def tfidf_similarity(text1, text2):
    try:
        if not text1.strip() or not text2.strip():
            return 0.0
            
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([text1, text2])
        # Calculate cosine similarity
        cosine_sim = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        return cosine_sim * 100
    except Exception as e:
        print(f"⚠️ Error in TF-IDF similarity: {e}")
        return 0.0

# Simple text similarity (replacement for BERT)
def simple_similarity(text1, text2):
    try:
        # Simple word overlap similarity
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return (len(intersection) / len(union)) * 100
    except Exception as e:
        print(f"⚠️ Error in simple similarity: {e}")
        return 0.0

# Skill match scoring
def skill_match_score(resume_skills, jd_skills):
    try:
        if not jd_skills:
            return 0
        matched = resume_skills & jd_skills
        return (len(matched) / len(jd_skills)) * 100
    except Exception as e:
        print(f"⚠️ Error in skill match scoring: {e}")
        return 0.0

# Final hybrid score
def hybrid_score(skill_score, tfidf_score, simple_score, weights=(0.4, 0.3, 0.3)):
    try:
        return round(weights[0]*skill_score + weights[1]*tfidf_score + weights[2]*simple_score, 2)
    except Exception as e:
        print(f"⚠️ Error in hybrid scoring: {e}")
        return 0.0

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
    try:
        resume_text = extract_text_from_url(resume_url)
        resume_skills = extract_skills(resume_text, skill_keywords)
        jd_skills = extract_skills(jd_text, skill_keywords)

        skill_score = skill_match_score(resume_skills, jd_skills)
        tfidf_score = tfidf_similarity(resume_text, jd_text)
        simple_score = simple_similarity(resume_text, jd_text)
        final_score = hybrid_score(skill_score, tfidf_score, simple_score)

        return {
            "resumeSkills": sorted(resume_skills),
            "jdSkills": sorted(jd_skills),
            "matchedSkills": sorted(resume_skills & jd_skills),
            "missingSkills": sorted(jd_skills - resume_skills),
            "skillScore": round(skill_score, 2),
            "tfidfScore": round(tfidf_score, 2),
            "bertScore": round(simple_score, 2),  # Keep same key for compatibility
            "hybridScore": final_score
        }
    except Exception as e:
        print(f"❌ Error in resume analysis: {str(e)}")
        # Return default values on error
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
