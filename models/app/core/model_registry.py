import json
import tensorflow as tf
from pathlib import Path

class ModelRegistry:
    def __init__(self, model_dir: Path):
        self.models = {}
        self.labels = {}
        self.image_sizes = {}
        self._load(model_dir)

    def _load(self, model_dir: Path):
        configs = {
            "animal": {
                "model": "animal_model.h5",
                "labels": "class_names.json",
                "image_size": (224, 224),
            },
            "bird": {
                "model": "bird_model.h5",
                "labels": "bird_class_names.json",
                "image_size": (299, 299),
            },
            "flower": {
                "model": "flower_model.h5",
                "labels": "flower_class_names.json",
                "image_size": (299, 299),
            },
            "sound": {
                "model": "animal_sound_model.h5",
                "labels": "animal_sound_class.json",
                "image_size": None,
            },
        }

        for key, cfg in configs.items():
            model_path = model_dir / cfg["model"]
            self.models[key] = tf.keras.models.load_model(
                model_path, compile=False
            )

            self.image_sizes[key] = cfg["image_size"]

            if cfg["labels"]:
                with open(model_dir / cfg["labels"], "r") as f:
                    self.labels[key] = json.load(f)
            else:
                self.labels[key] = None

    def get_model(self, model_type):
        return self.models.get(model_type)

    def get_labels(self, model_type):
        return self.labels.get(model_type)

    def get_image_size(self, model_type):
        return self.image_sizes.get(model_type)
