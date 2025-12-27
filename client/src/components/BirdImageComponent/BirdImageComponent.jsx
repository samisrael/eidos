import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import "./BirdImageComponent.css";

const BirdImageComponent = () => {
  return (
    <BasePredictComponent
      apiUrl="http://localhost:8000/predict/bird"
      accept="image/*"
      inputLabel="Upload bird image"
      previewType="image"
    />
  );
};

export default BirdImageComponent;
