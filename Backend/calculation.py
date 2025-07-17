import spacy
import requests
from io import BytesIO
import fitz  # PyMuPDF
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
from spacy.matcher import PhraseMatcher

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️ spaCy model not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

# Load BERT model
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Skill keywords
skill_keywords = {
    "python", "java", "c++", "sql", "react", "node.js", "django", "flask", "html", "css",
    "tensorflow", "keras", "pytorch", "mongodb", "git", "docker", "aws", "azure", "linux",
    "communication", "leadership", "problem solving", "teamwork", "javascript", "typescript",
    "next.js", "vue", "angular", "express", "fastapi", "mysql", "postgres", "firebase"
}

known_degrees = ["btech", "mtech", "b.e", "m.e", "bachelor", "master", "phd"]
known_branches = ["computer science", "information technology", "mechanical", "electrical", "electronics", "civil"]

# Extract text from PDF
def extract_text_from_url(pdf_url):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        raise Exception("Failed to download PDF")
    doc = fitz.open(stream=BytesIO(response.content), filetype="pdf")
    return "\n".join([page.get_text() for page in doc])

# Skill extraction
def extract_skills(text, keywords):
    text = text.lower()
    if not nlp:
        return {k for k in keywords if k in text}
    doc = nlp(text)
    return {token.text for token in doc if token.text in keywords}

# Field extraction (CGPA, Degree, Branch, Experience)
def extract_fields(text):
    lower = text.lower()
    fields = {}

    # CGPA or GPA
    match = re.search(r'(?:cgpa|gpa)[^0-9]{0,5}([0-9]\.\d+)', lower)
    fields["cgpa"] = float(match.group(1)) if match else None

    # Experience
    match = re.search(r'(\d+)\+?\s*(?:years|yrs)\s+(?:of\s+)?experience', lower)
    fields["experience"] = int(match.group(1)) if match else None

    # Degree & Branch using spaCy matcher
    if nlp:
        doc = nlp(lower)
        degree_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        degree_matcher.add("DEGREE", [nlp.make_doc(d) for d in known_degrees])
        for _, start, end in degree_matcher(doc):
            fields["degree"] = doc[start:end].text
            break

        branch_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        branch_matcher.add("BRANCH", [nlp.make_doc(b) for b in known_branches])
        for _, start, end in branch_matcher(doc):
            fields["branch"] = doc[start:end].text
            break

    return fields

# TF-IDF score
def tfidf_similarity(t1, t2):
    if not t1.strip() or not t2.strip():
        return 0.0
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([t1, t2])
    return cosine_similarity(vectors[0:1], vectors[1:2])[0][0] * 100

# BERT similarity
def bert_similarity(t1, t2):
    if not t1.strip() or not t2.strip():
        return 0.0
    embeddings = bert_model.encode([t1, t2], convert_to_tensor=True)
    return util.pytorch_cos_sim(embeddings[0], embeddings[1]).item() * 100

# Skill match %
def skill_match_score(resume_skills, jd_skills):
    if not jd_skills:
        return 0.0
    return (len(resume_skills & jd_skills) / len(jd_skills)) * 100

# Hybrid score
def hybrid_score(skill_score, tfidf_score, bert_score, weights=(0.4, 0.3, 0.3)):
    return round(weights[0]*skill_score + weights[1]*tfidf_score + weights[2]*bert_score, 2)

# 🧠 Analyze function
def analyze_resume_against_jd(resume_url, jd_text):
    try:
        resume_text = extract_text_from_url(resume_url)
        resume_skills = extract_skills(resume_text, skill_keywords)
        jd_skills = extract_skills(jd_text, skill_keywords)
        resume_fields = extract_fields(resume_text)
        jd_fields = extract_fields(jd_text)

        skill_score = skill_match_score(resume_skills, jd_skills)
        tfidf_score = tfidf_similarity(resume_text, jd_text)
        bert_score = bert_similarity(resume_text, jd_text)
        final_score = hybrid_score(skill_score, tfidf_score, bert_score)

        return {
            "resumeSkills": sorted(resume_skills),
            "jdSkills": sorted(jd_skills),
            "matchedSkills": sorted(resume_skills & jd_skills),
            "missingSkills": sorted(jd_skills - resume_skills),
            "resumeFields": resume_fields,
            "jdFields": jd_fields,
            "skillScore": round(skill_score, 2),
            "tfidfScore": round(tfidf_score, 2),
            "bertScore": round(bert_score, 2),
            "hybridScore": final_score
        }
    except Exception as e:
        print(f"❌ Error: {e}")
        return {
            "resumeSkills": [], "jdSkills": [], "matchedSkills": [], "missingSkills": [],
            "resumeFields": {}, "jdFields": {},
            "skillScore": 0.0, "tfidfScore": 0.0, "bertScore": 0.0, "hybridScore": 0.0
        }
