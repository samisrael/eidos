import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import "./FlowerImageComponent.css";

const FlowerImageComponent = () => {
  return (
    <BasePredictComponent
      apiUrl="http://localhost:8000/predict/flower"
      accept="image/*"
      inputLabel="Upload flower image"
      previewType="image"
    />
  );
};

export default FlowerImageComponent;
