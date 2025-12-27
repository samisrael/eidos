import io
import numpy as np
from PIL import Image
import librosa
import numpy as np


def preprocess_image(image_bytes: bytes, target_size: tuple):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    arr = np.asarray(img, dtype="float32") / 255.0
    return arr[None, ...]



def preprocess_audio(audio_bytes: bytes, sr=22050, duration=5):
    y, _ = librosa.load(io.BytesIO(audio_bytes), sr=sr, duration=duration)

    mel = librosa.feature.melspectrogram(
        y=y,
        sr=sr,
        n_mels=128,
        n_fft=2048,
        hop_length=512
    )

    mel_db = librosa.power_to_db(mel, ref=np.max)

    mel_db = (mel_db - mel_db.min()) / (mel_db.max() - mel_db.min())

    if mel_db.shape[1] < 128:
        pad = 128 - mel_db.shape[1]
        mel_db = np.pad(mel_db, ((0, 0), (0, pad)))
    else:
        mel_db = mel_db[:, :128]

    mel_db = mel_db[..., np.newaxis]

    return mel_db[np.newaxis, ...]
