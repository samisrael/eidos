import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import "./AnimalImageComponent.css";

const AnimalImageComponent = () => {
  return (
    <BasePredictComponent
      apiUrl="http://localhost:8000/predict/animal"
      accept="image/*"
      inputLabel="Upload animal image"
      previewType="image"
    />
  );
};

export default AnimalImageComponent;
