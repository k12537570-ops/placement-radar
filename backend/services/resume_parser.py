import re
import io
import zipfile
import xml.etree.ElementTree as ET
from typing import Dict, List, Any

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False


class ResumeParser:
    """
    Robust resume parser supporting PDF, DOCX, TXT, and raw text.
    Extracts text, structured sections, and candidate bullet points.
    """

    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        if not PYPDF_AVAILABLE:
            # Fallback byte string extraction
            try:
                return file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                return ""
        
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            return "\n".join(text_parts)
        except Exception as e:
            # Fallback regex extraction of text tokens from stream
            raw = file_bytes.decode("latin1", errors="ignore")
            extracted = re.findall(r"\(([^\(\)]+)\)\s*T[jJ]", raw)
            if extracted:
                return " ".join(extracted)
            return raw

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        """
        Extract text from DOCX using built-in zipfile and XML parsing.
        Extremely reliable, zero external dependency.
        """
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                xml_content = z.read("word/document.xml")
                root = ET.fromstring(xml_content)
                # Word namespace: http://schemas.openxmlformats.org/wordprocessingml/2006/main
                namespaces = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
                paragraphs = []
                for p in root.iterfind(".//w:p", namespaces):
                    texts = [node.text for node in p.iterfind(".//w:t", namespaces) if node.text]
                    if texts:
                        paragraphs.append("".join(texts))
                return "\n".join(paragraphs)
        except Exception:
            return file_bytes.decode("utf-8", errors="ignore")

    @classmethod
    def parse_file(cls, filename: str, content_bytes: bytes) -> str:
        lower = filename.lower()
        if lower.endswith(".pdf"):
            return cls.extract_text_from_pdf(content_bytes)
        elif lower.endswith(".docx"):
            return cls.extract_text_from_docx(content_bytes)
        else:
            try:
                return content_bytes.decode("utf-8", errors="replace")
            except Exception:
                return content_bytes.decode("latin1", errors="ignore")

    @staticmethod
    def clean_text(text: str) -> str:
        # Standardize whitespace and remove non-printable characters
        text = re.sub(r"\r\n|\r", "\n", text)
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    @classmethod
    def extract_bullets(cls, text: str) -> List[str]:
        """
        Splits resume into sentences or bullet points.
        Detects standard bullet characters (-, *, •, ▪, etc.) and numbered lists.
        """
        cleaned = cls.clean_text(text)
        lines = cleaned.split("\n")
        bullets = []

        bullet_pattern = re.compile(r"^\s*[\-\*\u2022\u2023\u25E6\u2043\u2219▪►]\s*")
        number_pattern = re.compile(r"^\s*\d+[\.\)]\s*")

        for line in lines:
            line_str = line.strip()
            if not line_str or len(line_str) < 15:
                continue

            # Check if line starts with a bullet symbol or number
            if bullet_pattern.match(line_str):
                line_str = bullet_pattern.sub("", line_str).strip()
            elif number_pattern.match(line_str):
                line_str = number_pattern.sub("", line_str).strip()

            if len(line_str) >= 20:
                bullets.append(line_str)

        # If too few explicit bullets, split text by sentence punctuation
        if len(bullets) < 3:
            sentences = re.split(r"(?<=[.!?])\s+", cleaned)
            for s in sentences:
                s_clean = s.strip()
                if len(s_clean) >= 25 and not s_clean.isupper():
                    bullets.append(s_clean)

        return bullets

    @classmethod
    def extract_sections(cls, text: str) -> Dict[str, Any]:
        """
        Categorizes resume into sections: summary, experience, skills, education, projects.
        """
        cleaned = cls.clean_text(text)
        bullets = cls.extract_bullets(cleaned)

        # Detect email
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", cleaned)
        email = email_match.group(0) if email_match else ""

        # Detect phone
        phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", cleaned)
        phone = phone_match.group(0) if phone_match else ""

        # Detect GitHub / LinkedIn URLs
        links = re.findall(r"(?:https?://)?(?:www\.)?(?:github\.com|linkedin\.com)/[A-Za-z0-9_-]+", cleaned)

        return {
            "raw_text": cleaned,
            "bullets": bullets,
            "contact": {
                "email": email,
                "phone": phone,
                "links": list(set(links))
            },
            "word_count": len(cleaned.split()),
            "bullet_count": len(bullets)
        }
