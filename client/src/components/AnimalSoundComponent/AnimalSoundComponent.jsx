import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import "./AnimalSoundComponent.css";

const AnimalSoundComponent = () => {
  return (
    <BasePredictComponent
      apiUrl="http://localhost:8000/predict/sound"
      accept="audio/*"
      inputLabel="Upload animal sound"
      previewType="audio"
    />
  );
};

export default AnimalSoundComponent;
