import os
import json
from typing import List, Dict, Any, Optional

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "data")


class PathwayService:
    def __init__(self, skill_extractor):
        self.skill_extractor = skill_extractor
        self.courses_file = os.path.join(DATA_DIR, "courses.json")
        self.courses: Dict[str, List[Dict[str, Any]]] = self._load_courses()

    def _load_courses(self) -> Dict[str, List[Dict[str, Any]]]:
        try:
            with open(self.courses_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load courses file: {e}")
            return {}

    def generate_pathway(
        self,
        missing_skills: List[Dict[str, Any]],
        existing_skills: List[str]
    ) -> Dict[str, Any]:
        """
        Generates a chronological, prerequisite-aware learning roadmap.
        Categorizes skills into 'Start Here', 'Then', and 'Finish With'.
        Provides 2 free learning resources per skill.
        """
        existing_set = set(existing_skills)
        missing_ids = [s["id"] for s in missing_skills]

        # Detailed enrichment
        enriched_skills = []
        for s in missing_skills:
            sid = s["id"]
            detail = self.skill_extractor.get_skill_details(sid) or {}
            prereqs = detail.get("prerequisites", [])
            importance = s.get("importance_score", detail.get("importance_score", 0.8))
            is_must_have = s.get("is_must_have", True)
            
            # Fetch 2 free resources
            skill_resources = self.courses.get(sid, [
                {
                    "title": f"Official {s.get('name', sid.title())} Quickstart & Documentation",
                    "provider": "Official Docs",
                    "url": f"https://devdocs.io/#q={sid}",
                    "type": "Interactive Guide",
                    "cost": "Free",
                    "estimated_time": "8 hours"
                },
                {
                    "title": f"{s.get('name', sid.title())} Full Course & Hands-on Lab",
                    "provider": "freeCodeCamp",
                    "url": "https://www.freecodecamp.org/learn",
                    "type": "Video & Code Workshop",
                    "cost": "Free",
                    "estimated_time": "12 hours"
                }
            ])[:2]

            # Priority assignment
            if is_must_have and importance >= 0.88:
                priority = "High"
            elif is_must_have or importance >= 0.82:
                priority = "Medium"
            else:
                priority = "Low"

            hours = detail.get("learning_hours", s.get("learning_hours", 18))
            why = detail.get("why_it_matters", s.get("why_it_matters", f"Essential modern tool for role competence."))

            enriched_skills.append({
                "id": sid,
                "name": s.get("name", sid.title()),
                "category": detail.get("category", s.get("category", "Technology")),
                "is_must_have": is_must_have,
                "importance_score": importance,
                "priority": priority,
                "prerequisites": prereqs,
                "learning_hours": hours,
                "why_it_matters": why,
                "resources": skill_resources,
                "completed": False
            })

        # Phase sorting logic (Start Here -> Then -> Finish With)
        start_here = []
        then_stage = []
        finish_with = []

        advanced_categories = {"Cloud & DevOps", "System Design", "Microservices"}

        for item in enriched_skills:
            sid = item["id"]
            prereqs = item["prerequisites"]
            unmet_prereqs = [p for p in prereqs if p not in existing_set and p in missing_ids]

            # If it has unmet missing prerequisites or belongs to advanced systems
            if item["category"] in advanced_categories or sid in {"system-design", "microservices", "ci-cd", "aws"}:
                item["stage"] = "Finish With"
                finish_with.append(item)
            elif not unmet_prereqs and item["priority"] in {"High", "Medium"}:
                item["stage"] = "Start Here"
                start_here.append(item)
            else:
                item["stage"] = "Then"
                then_stage.append(item)

        # Ensure balanced distribution if one stage is empty
        if not start_here and then_stage:
            start_here.append(then_stage.pop(0))
            start_here[0]["stage"] = "Start Here"
        elif not start_here and finish_with:
            start_here.append(finish_with.pop(0))
            start_here[0]["stage"] = "Start Here"

        total_hours = sum(s["learning_hours"] for s in enriched_skills)

        return {
            "total_missing_skills": len(enriched_skills),
            "estimated_total_hours": total_hours,
            "stages": {
                "start_here": {
                    "stage_name": "Start Here",
                    "tagline": "Foundational prerequisites & immediate high-priority gaps",
                    "skills": start_here
                },
                "then": {
                    "stage_name": "Then",
                    "tagline": "Core frameworks & practical implementation skills",
                    "skills": then_stage
                },
                "finish_with": {
                    "stage_name": "Finish With",
                    "tagline": "Cloud, deployment pipelines & scalable system architecture",
                    "skills": finish_with
                }
            },
            "all_skills_flat": enriched_skills
        }
