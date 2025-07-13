from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from getData import router as data_router
from hr_matches import router as hr_router
from uploads import router as resume_router

app = FastAPI()

import os
from dotenv import load_dotenv
load_dotenv()

# CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Resume Analyzer Backend is running!"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Backend is operational",
        "jwt_secret_configured": bool(os.getenv("JWT_SECRET"))
    }

app.include_router(auth_router, prefix="/auth")
app.include_router(resume_router,prefix="/resume")
app.include_router(data_router, prefix="/getme")
app.include_router(hr_router, prefix="/hr")
