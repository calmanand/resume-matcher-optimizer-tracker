def generate_feedback(resume_text, analysis_results):
    """
    Plaintext AI-style feedback for resume vs JD comparison.
    No markdown/bold symbols. Uses all caps for section headers.
    """

    skill_score = analysis_results.get("skillScore", 0)
    hybrid_score = analysis_results.get("hybridScore", 0)
    missing_skills = analysis_results.get("missingSkills", [])
    resume_length = len(resume_text.split())

    resume_fields = analysis_results.get("resumeFields", {})
    jd_fields = analysis_results.get("jdFields", {})

    feedback = []

    # --- Skills & Similarity Feedback ---
    feedback.append(
        f"Based on the resume analysis, the skill relevance score is {skill_score}% and the overall compatibility (hybrid) score is {hybrid_score}%. This reflects how well your resume aligns with the job description."
    )

    if missing_skills:
        feedback.append(
            f"The following relevant skills were missing in your resume: {', '.join(missing_skills[:5])}. Consider adding them where applicable."
        )

    # --- Resume Content Length Feedback ---
    if resume_length < 200:
        feedback.append("Your resume is quite concise. You might want to elaborate more on your experience, skills, or projects.")
    else:
        feedback.append("Resume length appears sufficient and provides good context.")

    # --- Section Check ---
    if "experience" not in resume_text.lower() or "education" not in resume_text.lower():
        feedback.append("Ensure both 'Experience' and 'Education' sections are clearly present in your resume.")

    # --- Strict Field Validations ---
    field_errors = []

    # Degree
    if jd_fields.get("degree"):
        resume_degree = resume_fields.get("degree")
        if not resume_degree:
            field_errors.append(f"Degree required: {jd_fields['degree']} — but no degree was detected in your resume.")
        elif jd_fields["degree"].lower() not in resume_degree.lower():
            field_errors.append(f"Degree mismatch: JD expects {jd_fields['degree']}, but your resume has {resume_degree}.")

    # Branch
    if jd_fields.get("branch"):
        resume_branch = resume_fields.get("branch")
        if not resume_branch:
            field_errors.append(f"Branch required: {jd_fields['branch']} — but no branch or stream found in resume.")
        elif jd_fields["branch"].lower() not in resume_branch.lower():
            field_errors.append(f"Branch mismatch: JD needs {jd_fields['branch']}, but your resume shows {resume_branch}.")

    # CGPA
    if jd_fields.get("cgpa"):
        resume_cgpa = resume_fields.get("cgpa")
        if resume_cgpa is None:
            field_errors.append(f"CGPA required: {jd_fields['cgpa']} — but your resume does not mention any CGPA.")
        elif resume_cgpa < jd_fields["cgpa"]:
            field_errors.append(f"CGPA below cutoff: Required is {jd_fields['cgpa']}, but yours is {resume_cgpa}.")

    # Experience
    if jd_fields.get("experience"):
        resume_exp = resume_fields.get("experience")
        if resume_exp is None:
            field_errors.append(f"Experience required: {jd_fields['experience']} years — but experience info is missing.")
        elif resume_exp < jd_fields["experience"]:
            field_errors.append(f"Experience below requirement: JD expects {jd_fields['experience']} years, but only {resume_exp} years were found.")

    # Add all strict field error messages if any
    if field_errors:
        feedback.append("STRICT VIOLATIONS:")
        feedback.extend(field_errors)
        feedback.append("Based on these mismatches, your resume may not pass initial eligibility filters.")

    # --- Final Evaluation Summary ---
    if hybrid_score < 50:
        feedback.append("Overall, the resume shows a low match to the role. Improve skills alignment and address eligibility gaps.")
    elif hybrid_score < 80:
        feedback.append("The resume shows moderate alignment. Add more relevant experience and address skill or field mismatches.")
    else:
        feedback.append("Your resume shows a strong match to the role. Make sure it's tailored for each job application.")

    return {
        "feedback": feedback,
        "overallScore": hybrid_score,
        "recommendations": 1
    }
