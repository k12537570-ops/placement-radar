import os
import json
from typing import List, Dict, Any, Optional

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "data")


class ProjectRecommender:
    def __init__(self):
        self.projects_file = os.path.join(DATA_DIR, "projects.json")
        self.projects: List[Dict[str, Any]] = self._load_projects()

    def _load_projects(self) -> List[Dict[str, Any]]:
        try:
            with open(self.projects_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load projects file: {e}")
            return []

    def recommend_projects(
        self,
        missing_skill_ids: List[str],
        user_skill_ids: List[str],
        limit: int = 4
    ) -> List[Dict[str, Any]]:
        """
        Recommends 3-5 tailored projects that maximize coverage of the user's missing skills,
        leveraging their existing skills as building blocks.
        """
        missing_set = set(missing_skill_ids)
        user_set = set(user_skill_ids)

        scored_projects = []

        for p in self.projects:
            covered = set(p.get("skills_covered", []))
            
            # Missing skills this project actively addresses
            addressed_gaps = covered.intersection(missing_set)
            # Existing candidate skills this project leverages
            leveraged_skills = covered.intersection(user_set)

            # Score formula: 3 points per missing skill addressed + 1 point for leveraged foundation
            relevance_score = (len(addressed_gaps) * 3) + len(leveraged_skills)

            project_copy = dict(p)
            project_copy["addressed_gaps"] = list(addressed_gaps)
            project_copy["leveraged_skills"] = list(leveraged_skills)
            project_copy["relevance_score"] = relevance_score
            project_copy["status"] = "Not Started"  # Tracking status

            scored_projects.append(project_copy)

        # Sort descending by relevance score
        scored_projects.sort(key=lambda x: x["relevance_score"], reverse=True)

        # Return top N projects (ensuring at least 3-5)
        top_projects = scored_projects[:max(3, min(limit, len(scored_projects)))]
        return top_projects
