from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_DIR = BASE_DIR / "model"

ALLOWED_ORIGINS = ["http://localhost:5173"]
