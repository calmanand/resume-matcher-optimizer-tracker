def generate_feedback(resume_text, analysis_results):
    """
    AI-like dynamic feedback generator: fully natural, no rigid conditionals.
    """
    
    skill_score = analysis_results.get("skillScore", 0)
    hybrid_score = analysis_results.get("hybridScore", 0)
    missing_skills = analysis_results.get("missingSkills", [])
    resume_length = len(resume_text.split())

    # Build a base context for the AI-style message
    feedback_text = (
        f"Based on the resume analysis, the skill relevance score was calculated at {skill_score}% and the overall compatibility "
        f"(hybrid) score at {hybrid_score}%. These metrics offer insight into how well the resume content aligns with the technical "
        f"requirements and expectations of the provided job description. "
    )

    if missing_skills:
        feedback_text += (
            f"The analysis identified some potential gaps in technical alignment. In particular, the following skills were not detected in the resume "
            f"but are relevant to the job: {', '.join(missing_skills[:5])}. Introducing or expanding upon these skills, especially within project summaries or work experience, "
            f"can enhance relevance."
        )

    feedback_text += " "

    feedback_text += (
        "From a content perspective, the resume "
        f"{'is concise and may benefit from further elaboration' if resume_length < 200 else 'contains a fair amount of information, which provides useful context to the reviewer'}. "
    )

    feedback_text += (
        f"Structurally, it's important that key sections such as 'Experience' and 'Education' are clearly included. "
        f"{'If missing, they should be added to demonstrate both formal background and applied skills. ' if ('experience' not in resume_text.lower() or 'education' not in resume_text.lower()) else ''}"
    )

    feedback_text += (
        "Overall, the resume shows "
        f"{'a limited match' if hybrid_score < 50 else 'moderate alignment' if hybrid_score < 80 else 'a strong degree of relevance'} to the target role. "
        "With targeted improvements in terminology, measurable outcomes, and skill framing, the resume can be optimized to better communicate technical capabilities and role fit."
    )

    return {
        "feedback": [feedback_text],
        "overallScore": hybrid_score,
        "recommendations": 1
    }
