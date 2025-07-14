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
    # Programming Languages
    "python", "java", "c", "c++", "c#", "javascript", "js", "typescript", "ts", "ruby", "go", "golang", "rust",
    "bash", "shell", "powershell", "r", "swift", "kotlin", "objective-c", "perl", "matlab", "scala",

    # Data Science / ML / AI
    "numpy", "pandas", "matplotlib", "seaborn", "scikit-learn", "sklearn", "tensorflow", "keras", "pytorch", "openai", 
    "huggingface", "transformers", "xgboost", "lightgbm", "catboost", "nltk", "spacy", "statsmodels", "mlflow", 
    "opencv", "cv2", "jupyter", "jupyter notebook", "colab", "google colab",

    # Database / Data Engineering
    "sql", "mysql", "postgresql", "postgres", "sqlite", "mssql", "oracle", "mongodb", "mongo", "firebase", 
    "bigquery", "snowflake", "redis", "cassandra", "elasticsearch", "dynamodb", "neo4j", "graph database",

    # Web Dev - Frontend
    "html", "css", "scss", "sass", "tailwind", "tailwind css", "bootstrap", "material ui", "mui", 
    "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "angular", "angular.js", "jquery",

    # Web Dev - Backend
    "node.js", "nodejs", "express", "express.js", "fastapi", "flask", "django", "spring", "spring boot",
    "nest.js", "nestjs", "graphql", "rest", "rest api", "restful api", "axios", "rpc", "grpc", 

    # DevOps / Tools / Infra
    "git", "github", "gitlab", "bitbucket", "ci/cd", "jenkins", "docker", "docker-compose", "kubernetes", "k8s",
    "terraform", "ansible", "prometheus", "grafana", "nginx", "apache", "linux", "ubuntu", "wsl", "zsh", "vim", 
    "vs code", "vscode", "terminal", "shell scripting",

    # Cloud
    "aws", "azure", "gcp", "google cloud", "heroku", "cloudinary", "netlify", "vercel",

    # Networking & Security
    "tcp/ip", "udp", "arp", "http", "https", "dns", "ip addressing", "ip", "routing", "subnetting", 
    "osi model", "bgp", "ospf", "icmp", "vpn", "firewall", "ssl", "tls", "md5", "sha256", "encryption", 
    "cybersecurity", "ethical hacking",

    # Realtime / Integration
    "socket.io", "websocket", "mqtt", "rabbitmq", "kafka", "cron", "webhooks", "api gateway", "fuse.js",

    # Tools / Miscellaneous
    "postman", "swagger", "openapi", "jira", "figma", "canva", "notion", "draw.io", "miro", 
    "excel", "power bi", "tableau", "looker", "datastudio", 

    # Soft Skills
    "communication", "leadership", "problem solving", "teamwork", "collaboration", 
    "critical thinking", "analytical thinking", "adaptability", "time management", 
    "creativity", "attention to detail"
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
