from pathlib import Path
from typing import Dict, List, Optional

import io
import json

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

import numpy as np
from PIL import Image
import tensorflow as tf


# -------- CONFIG --------
ROOT = Path(__file__).resolve().parents[1]  # project root (animal_image_model/)
MODEL_PATH = ROOT / "model" / "animal_model.h5"
CLASS_NAMES_PATH = ROOT / "model" / "class_names.json"
TARGET_SIZE = (224, 224)  # set this to whatever your model expects
ALLOWED_ORIGINS = ["http://localhost:5173"]  # add your frontend origin(s)
# ------------------------


app = FastAPI(title="Animal Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_class_names(path: Path) -> List[str]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as fh:
        data = json.load(fh)
        if isinstance(data, list):
            return data
        raise ValueError("class_names.json must be a JSON array of strings")


def build_labels_map(names: List[str]) -> Dict[int, str]:
    return {i: name for i, name in enumerate(names)}


# load class names
try:
    CLASS_NAMES = load_class_names(CLASS_NAMES_PATH)
    LABELS_MAP = build_labels_map(CLASS_NAMES)
except Exception:
    CLASS_NAMES = []
    LABELS_MAP = {}


# load model once, without compiling to avoid metric warnings
if not MODEL_PATH.exists():
    raise RuntimeError(f"Model file not found at {MODEL_PATH}")
try:
    MODEL = tf.keras.models.load_model(str(MODEL_PATH), compile=False)
except Exception as exc:
    raise RuntimeError(f"Failed to load model: {exc}")


def preprocess_image_bytes(image_bytes: bytes, target_size: tuple = TARGET_SIZE) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    arr = np.asarray(img).astype("float32") / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr


@app.get("/", response_class=JSONResponse)
async def root():
    return {"status": "ok", "message": "Animal Classifier API"}


@app.get("/labels")
async def labels():
    # return keys as strings so JSON is stable across clients
    return {str(k): v for k, v in LABELS_MAP.items()}


@app.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    # validate content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload an image file")

    contents = await file.read()
    try:
        x = preprocess_image_bytes(contents)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")

    # inference
    try:
        preds = MODEL.predict(x)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    # handle typical classification outputs
    if isinstance(preds, (list, tuple)):
        preds = np.asarray(preds[0])
    preds = np.asarray(preds)

    if preds.ndim == 2:
        probs = preds[0]
        idx = int(np.argmax(probs))
        confidence = float(np.max(probs))
    elif preds.ndim == 1:
        # single batch case
        if probs := preds:
            idx = int(np.argmax(probs))
            confidence = float(np.max(probs))
        else:
            idx = int(np.round(preds[0]))
            confidence = float(preds[0])
    else:
        # fallback
        idx = int(np.argmax(preds))
        confidence = float(np.max(preds))

    label = LABELS_MAP.get(idx, CLASS_NAMES[idx] if idx < len(CLASS_NAMES) else str(idx))

    return {"pred_class": idx, "label": label, "confidence": confidence}
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
