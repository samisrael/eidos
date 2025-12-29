import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import Ballpit from "../Ballpit/Ballpit";
import "../AnimalImageComponent/AnimalImageComponent.css";

const AnimalSoundComponent = () => {
  return (
    <div className="predict-root">
      {/* Ballpit background */}
      <div className="predict-bg animal-image-bg">
        <Ballpit
          count={200}
          gravity={0.7}
          friction={0.8}
          wallBounce={0.95}
          followCursor={true}
        />
      </div>

      {/* Foreground predictor */}
    <div className="predict-bg animal-sound-bg">
      <BasePredictComponent
        apiUrl="http://localhost:8000/predict/sound"
        accept="audio/*"
        inputLabel="Upload animal sound"
        previewType="audio"
      />
    </div>
    </div>
  );
};

export default AnimalSoundComponent;

