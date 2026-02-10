"""
Matching logic: score job-profile pairs by skills, experience level, and location.
Returns list of { "id", "score", "criteria" } with score 0-100 and criteria used.
"""
import re


def _normalize(text):
    if not text:
        return ""
    return " ".join(re.split(r"\s+", str(text).lower().strip()))


def _tokenize(text):
    s = _normalize(text)
    return set(re.findall(r"[a-z0-9]+", s)) if s else set()


def _score_skills_overlap(profile_skills, job_skills):
    if not job_skills:
        return 100
    p_tokens = _tokenize(profile_skills or "")
    j_tokens = _tokenize(job_skills or "")
    if not j_tokens:
        return 100
    overlap = len(p_tokens & j_tokens) / len(j_tokens)
    return min(100, int(overlap * 100))


def _score_experience(profile_level, profile_years, job_level_required):
    if not job_level_required:
        return 100
    levels = {"entry": 0, "mid": 1, "senior": 2, "lead": 3, "executive": 4}
    j = levels.get(_normalize(job_level_required).split()[0] if job_level_required else "", 0)
    p = levels.get(_normalize(profile_level or "").split()[0] if profile_level else "", 0)
    years = int(profile_years) if profile_years is not None else 0
    if p >= j and (j <= 1 or years >= 2):
        return 100
    if p >= j - 1:
        return 80
    if years >= 3:
        return 70
    return max(0, 60 - (j - p) * 20)


def _score_location(profile_location, job_location):
    if not job_location or not profile_location:
        return 100
    p = _normalize(profile_location)
    j = _normalize(job_location)
    if p == j:
        return 100
    if p in j or j in p:
        return 85
    return 50


def score_profile_for_job(profile, job):
    criteria = []
    s_skills = _score_skills_overlap(profile.get("skills"), job.get("skills_required"))
    if job.get("skills_required"):
        criteria.append("skills")
    s_exp = _score_experience(
        profile.get("experience_level"),
        profile.get("years_experience"),
        job.get("experience_level_required"),
    )
    if job.get("experience_level_required"):
        criteria.append("experience_level")
    s_loc = _score_location(profile.get("location"), job.get("location"))
    if job.get("location"):
        criteria.append("location")
    if not criteria:
        criteria = ["skills", "experience_level", "location"]
    weights = [0.5, 0.3, 0.2]
    scores = [s_skills, s_exp, s_loc]
    total = sum(w * s for w, s in zip(weights, scores))
    return round(min(100, total)), criteria


def score_job_for_profile(job, profile):
    criteria = []
    s_skills = _score_skills_overlap(profile.get("skills"), job.get("skills_required"))
    if job.get("skills_required"):
        criteria.append("skills")
    s_exp = _score_experience(
        profile.get("experience_level"),
        profile.get("years_experience"),
        job.get("experience_level_required"),
    )
    if job.get("experience_level_required"):
        criteria.append("experience_level")
    s_loc = _score_location(profile.get("location"), job.get("location"))
    if job.get("location"):
        criteria.append("location")
    if not criteria:
        criteria = ["skills", "experience_level", "location"]
    weights = [0.5, 0.3, 0.2]
    scores = [s_skills, s_exp, s_loc]
    total = sum(w * s for w, s in zip(weights, scores))
    return round(min(100, total)), criteria


def match_job(job, profiles):
    results = []
    for p in profiles:
        score, criteria = score_profile_for_job(p, job)
        results.append({"id": p["id"], "score": score, "criteria": criteria})
    results.sort(key=lambda x: -x["score"])
    return results


def match_profile(profile, jobs):
    results = []
    for j in jobs:
        score, criteria = score_job_for_profile(j, profile)
        results.append({"id": j["id"], "score": score, "criteria": criteria})
    results.sort(key=lambda x: -x["score"])
    return results
