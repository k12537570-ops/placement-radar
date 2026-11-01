import os
import json
import re
from typing import List, Dict, Any, Optional
from rapidfuzz import fuzz

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "data")


class SkillExtractor:
    def __init__(self, skills_file: Optional[str] = None):
        if not skills_file:
            skills_file = os.path.join(DATA_DIR, "skills.json")
        self.skills_file = skills_file
        self.skills: List[Dict[str, Any]] = self._load_skills()
        self.skill_map: Dict[str, Dict[str, Any]] = {s["id"]: s for s in self.skills}

    def _load_skills(self) -> List[Dict[str, Any]]:
        try:
            with open(self.skills_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load skills file: {e}")
            return []

    def extract_skills_from_text(self, text: str, bullets: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Extracts known skills from text using boundary-safe regex, alias mapping,
        and RapidFuzz similarity. Captures resume evidence for each detected skill.
        """
        if not text:
            return []

        text_lower = text.lower()
        if bullets is None:
            # Split text into sentences/lines for snippet context
            raw_lines = re.split(r"[\n\.\?!;]+", text)
            bullets = [line.strip() for line in raw_lines if len(line.strip()) > 15]

        detected_skills = []

        for skill in self.skills:
            skill_id = skill["id"]
            aliases = skill.get("aliases", [skill["name"].lower()])
            matched = False
            evidence_snippet = ""
            best_score = 0.0

            # 1. Check exact alias boundaries
            for alias in aliases:
                alias_clean = alias.strip().lower()
                # Use regex with boundary or special char check
                pattern = r"(?<![a-zA-Z0-9_\-\.\#])" + re.escape(alias_clean) + r"(?![a-zA-Z0-9_\-\.\#])"
                if re.search(pattern, text_lower):
                    matched = True
                    best_score = 1.0
                    break

            # 2. If not matched, try rapidfuzz on lines
            if not matched:
                for line in bullets:
                    line_lower = line.lower()
                    for alias in aliases:
                        ratio = fuzz.partial_ratio(alias.lower(), line_lower)
                        # High confidence partial ratio for distinct multi-word or long terms
                        if ratio >= 90 and len(alias) >= 4:
                            matched = True
                            best_score = ratio / 100.0
                            evidence_snippet = line
                            break
                    if matched:
                        break

            # 3. Find evidence snippet if matched by alias
            if matched and not evidence_snippet:
                for line in bullets:
                    line_lower = line.lower()
                    for alias in aliases:
                        if alias in line_lower:
                            evidence_snippet = line
                            break
                    if evidence_snippet:
                        break

            if matched:
                detected_skills.append({
                    "id": skill_id,
                    "name": skill["name"],
                    "category": skill.get("category", "General"),
                    "importance_score": skill.get("importance_score", 0.8),
                    "learning_hours": skill.get("learning_hours", 20),
                    "why_it_matters": skill.get("why_it_matters", ""),
                    "confidence": round(best_score, 2),
                    "evidence": evidence_snippet or f"Evidenced in candidate profile for {skill['name']}."
                })

        return detected_skills

    def get_skill_details(self, skill_id: str) -> Optional[Dict[str, Any]]:
        return self.skill_map.get(skill_id)

    def search_all_skills(self) -> List[Dict[str, Any]]:
        return self.skills
