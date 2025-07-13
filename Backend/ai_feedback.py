# ai_feedback.py - Simplified version without Google AI dependency

def generate_feedback(resume_text, analysis_results):
    """
    Generate feedback based on analysis results without external AI
    """
    feedback = []
    
    # Skill-based feedback
    if analysis_results.get("skillScore", 0) < 50:
        feedback.append("⚠️ Low skill match. Consider highlighting more relevant skills in your resume.")
    
    if analysis_results.get("missingSkills"):
        missing_skills = analysis_results["missingSkills"]
        if len(missing_skills) > 0:
            feedback.append(f"📝 Consider adding these skills: {', '.join(missing_skills[:5])}")
    
    # Overall score feedback
    hybrid_score = analysis_results.get("hybridScore", 0)
    if hybrid_score >= 80:
        feedback.append("🎉 Excellent match! Your resume aligns well with the job requirements.")
    elif hybrid_score >= 60:
        feedback.append("👍 Good match. Your resume shows potential but could be improved.")
    else:
        feedback.append("📋 Fair match. Consider tailoring your resume more to the job description.")
    
    # Content suggestions
    if len(resume_text.split()) < 200:
        feedback.append("📄 Your resume seems brief. Consider adding more details about your experience.")
    
    # Format suggestions
    if "experience" not in resume_text.lower():
        feedback.append("💼 Consider adding a detailed experience section.")
    
    if "education" not in resume_text.lower():
        feedback.append("🎓 Consider adding your educational background.")
    
    return {
        "feedback": feedback,
        "overallScore": hybrid_score,
        "recommendations": len(feedback)
    }
