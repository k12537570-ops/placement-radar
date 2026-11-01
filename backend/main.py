import os
import json
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.resume_parser import ResumeParser
from services.skill_extractor import SkillExtractor
from services.matcher import MatcherService
from services.pathway import PathwayService
from services.recommender import ProjectRecommender

app = FastAPI(
    title="SkillBridge API",
    description="AI-Powered Career and Skill Gap Analyzer Backend",
    version="1.0.0"
)

# Enable CORS for local Vite and production web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Services
skill_extractor = SkillExtractor()
matcher_service = MatcherService(skill_extractor)
pathway_service = PathwayService(skill_extractor)
project_recommender = ProjectRecommender()


# Pydantic Schemas
class ParseResumeTextRequest(BaseModel):
    resume_text: str

class ParseJobRequest(BaseModel):
    job_text: str

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_text: str
    custom_skills: Optional[List[str]] = None

class PathwayRequest(BaseModel):
    missing_skills: List[dict]
    existing_skills: List[str]

class ProjectsRequest(BaseModel):
    missing_skill_ids: List[str]
    user_skill_ids: List[str]
    limit: Optional[int] = 4


# Demo Data Definition (Realistic student resume & modern software developer job description)
DEMO_RESUME = """ALEX CHEN
Full Stack Developer & CS Senior
Email: alex.chen@university.edu | Phone: (555) 234-5678 | GitHub: github.com/alexchen-dev

SUMMARY
Computer Science senior with strong hands-on experience building full-stack web applications using React, Python, and JavaScript. Passionate about API design, clean code, and database modeling.

TECHNICAL SKILLS
Languages: Python, JavaScript, HTML5, CSS3, SQL
Frameworks & Libraries: React.js, Tailwind CSS, Express basics
Databases: PostgreSQL, SQLite
Tools: Git, GitHub, VS Code, Linux, Postman

PROJECTS & EXPERIENCE
Full Stack Task Manager (React, Python, PostgreSQL)
• Developed responsive single-page web application using React and Tailwind CSS for task tracking.
• Implemented RESTful API endpoints in Python with database CRUD transactions in PostgreSQL.
• Used Git for version control and feature branching across 15+ pull requests.
• Worked on authentication and user session persistence.

Campus Event Portal (JavaScript, HTML/CSS, SQL)
• Helped build front-end interface for student organization event registration.
• Created relational SQL database queries to filter events by category and date.
• Handled UI responsiveness across mobile and desktop devices.
• Assisted team with manual testing and bug fixing before release.

EDUCATION
B.S. in Computer Science — University of Technology (Expected Graduation: May 2027)
Relevant Coursework: Data Structures & Algorithms, Database Systems, Web Development, Object-Oriented Programming.
"""

DEMO_JOB = """Job Title: Junior / Mid Full-Stack Software Engineer
Company: CloudScale Technologies
Location: Hybrid / Remote

About the Role:
We are looking for a proactive Full Stack Engineer to join our core product team. You will build and scale high-performance web applications, architect asynchronous backend services, and collaborate on automated deployment pipelines.

Must-Have Requirements:
• 1+ years experience building modern web applications with React and JavaScript or TypeScript.
• Hands-on proficiency with Python and asynchronous backend frameworks (FastAPI or Django).
• Solid understanding of relational database schema design, indexing, and complex queries in PostgreSQL or SQL.
• Demonstrated competence with Git version control, pull requests, and collaborative code review.
• Practical understanding of RESTful API design and client-server state management.

Nice-to-Have Qualifications:
• Experience containerizing microservices with Docker and Docker Compose.
• Familiarity with Redis in-memory caching or message queues.
• Exposure to CI/CD automation pipelines using GitHub Actions.
• Knowledge of cloud deployment on AWS (EC2, S3) or modern container runtimes.
• Writing unit tests using PyTest or Jest.
"""


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "SkillBridge AI API",
        "endpoints": [
            "/parse-resume",
            "/parse-job",
            "/analyze",
            "/pathway",
            "/projects",
            "/demo-data"
        ]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "semantic_model": matcher_service.semantic_engine.model_name
    }

@app.get("/demo-data")
def get_demo_data():
    """
    Returns realistic sample student resume and software developer job description,
    plus pre-extracted skills for instantaneous zero-latency demoing.
    """
    resume_sections = ResumeParser.extract_sections(DEMO_RESUME)
    resume_skills = skill_extractor.extract_skills_from_text(DEMO_RESUME, resume_sections["bullets"])
    parsed_job = matcher_service.parse_job_description(DEMO_JOB)

    return {
        "demo_resume_text": DEMO_RESUME,
        "demo_job_text": DEMO_JOB,
        "extracted_resume_skills": resume_skills,
        "parsed_job_requirements": parsed_job
    }

@app.post("/parse-resume")
async def parse_resume(
    file: Optional[UploadFile] = File(None),
    text_data: Optional[str] = Form(None)
):
    """
    Parses resume from either an uploaded file (PDF/DOCX/TXT) or raw form text.
    Extracts structured text, bullets, contact metadata, and detected skills.
    """
    raw_text = ""
    filename = "pasted_resume.txt"

    if file:
        filename = file.filename or "resume"
        content_bytes = await file.read()
        raw_text = ResumeParser.parse_file(filename, content_bytes)
    elif text_data:
        raw_text = text_data
    else:
        raise HTTPException(status_code=400, detail="Either file upload or text_data must be provided.")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from resume.")

    sections = ResumeParser.extract_sections(raw_text)
    extracted_skills = skill_extractor.extract_skills_from_text(raw_text, sections["bullets"])

    return {
        "filename": filename,
        "text": sections["raw_text"],
        "bullets": sections["bullets"],
        "contact": sections["contact"],
        "extracted_skills": extracted_skills,
        "word_count": sections["word_count"]
    }

@app.post("/parse-job")
def parse_job(request: ParseJobRequest):
    """
    Parses job description into Must-Have vs Nice-to-Have requirements and skills.
    """
    if not request.job_text.strip():
        raise HTTPException(status_code=400, detail="Job description text is empty.")

    result = matcher_service.parse_job_description(request.job_text)
    return result

@app.post("/analyze")
def analyze_gap(request: AnalyzeRequest):
    """
    Comprehensive skill gap analysis and semantic matching endpoint.
    Computes weighted match score (65% must-haves, 20% nice-to-haves, 15% semantic similarity),
    evidence mapping, strengths & weaknesses, and resume improvement coaching.
    """
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required.")
    if not request.job_text.strip():
        raise HTTPException(status_code=400, detail="Job description text is required.")

    sections = ResumeParser.extract_sections(request.resume_text)
    detected_skills = skill_extractor.extract_skills_from_text(request.resume_text, sections["bullets"])
    skill_ids = [s["id"] for s in detected_skills]

    # Incorporate user-edited/custom skills
    if request.custom_skills:
        for cs in request.custom_skills:
            cs_clean = cs.strip().lower()
            if cs_clean and cs_clean not in skill_ids:
                skill_ids.append(cs_clean)

    analysis = matcher_service.analyze_resume_vs_job(
        resume_text=request.resume_text,
        resume_bullets=sections["bullets"],
        resume_skill_ids=skill_ids,
        job_text=request.job_text
    )

    # Attach extracted resume skills with evidence
    analysis["candidate_skills"] = detected_skills
    return analysis

@app.post("/pathway")
def generate_pathway(request: PathwayRequest):
    """
    Generates personalized chronological learning roadmap:
    Start Here, Then, Finish With with 2 free learning resources per skill.
    """
    roadmap = pathway_service.generate_pathway(
        missing_skills=request.missing_skills,
        existing_skills=request.existing_skills
    )
    return roadmap

@app.post("/projects")
def recommend_projects(request: ProjectsRequest):
    """
    Recommends 3-5 high-impact portfolio projects tailored to candidate's missing skills.
    """
    projects = project_recommender.recommend_projects(
        missing_skill_ids=request.missing_skill_ids,
        user_skill_ids=request.user_skill_ids,
        limit=request.limit or 4
    )
    return {"recommended_projects": projects}
