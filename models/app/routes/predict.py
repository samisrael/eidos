from fastapi import APIRouter, UploadFile, File, HTTPException
import numpy as np

from app.core.registry import registry
from app.core.preprocess import preprocess_image, preprocess_audio

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/{model_type}")
async def predict(model_type: str, file: UploadFile = File(...)):
    model = registry.get_model(model_type)
    labels = registry.get_labels(model_type)
    image_size = registry.get_image_size(model_type)

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    data = await file.read()

    try:
        if model_type == "sound":
            x = preprocess_audio(data)
        else:
            x = preprocess_image(data, image_size)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid input")

    preds = model.predict(x)
    probs = preds[0]
    idx = int(np.argmax(probs))
    confidence = float(probs[idx])

    label = labels[idx] if labels and idx < len(labels) else f"class_{idx}"

    return {
        "model": model_type,
        "class_index": idx,
        "label": label,
        "confidence": confidence,
    }