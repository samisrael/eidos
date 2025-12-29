import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import Ballpit from "../Ballpit/Ballpit";
import "./AnimalImageComponent.css";

const AnimalImageComponent = () => {
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
      <div className="predict-content">
        <BasePredictComponent
          apiUrl="http://localhost:8000/predict/animal"
          accept="image/*"
          inputLabel="Upload animal image"
          previewType="image"
        />
      </div>
    </div>
  );
};

export default AnimalImageComponent;
