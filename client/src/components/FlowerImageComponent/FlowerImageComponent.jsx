import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import Orb from "../Orb/Orb";
import "./FlowerImageComponent.css";

const FlowerImageComponent = () => {
  return (
    <div className="predict-root">
      {/* Orb background */}
      <div className="predict-bg flower-image-bg">
        <Orb
          hoverIntensity={0.4}
          rotateOnHover={true}
          hue={210}
          forceHoverState={false}
          backgroundColor="#050b18"
        />
      </div>

      {/* Foreground */}
      <div className="predict-content">
        <BasePredictComponent
          apiUrl="http://localhost:8000/predict/flower"
          accept="image/*"
          inputLabel="Upload flower image"
          previewType="image"
        />
      </div>
    </div>
  );
};

export default FlowerImageComponent;
