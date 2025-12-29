import React from "react";
import BasePredictComponent from "../BasePredictComponent/BasePredictComponent";
import PixelBlast from "../PixelBlast/PixelBlast";
import "./BirdImageComponent.css";

const BirdImageComponent = () => {
  return (
    <div className="predict-root">
      {/* PixelBlast background */}
      <div className="predict-bg bird-image-bg">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#9bbcff"
          patternScale={3}
          patternDensity={1.1}
          pixelSizeJitter={0.4}
          enableRipples
          rippleSpeed={0.35}
          rippleThickness={0.12}
          rippleIntensityScale={1.4}
          liquid
          liquidStrength={0.1}
          liquidRadius={1.2}
          liquidWobbleSpeed={4.5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Foreground predictor */}
      <div className="predict-content">
        <BasePredictComponent
          apiUrl="http://localhost:8000/predict/bird"
          accept="image/*"
          inputLabel="Upload bird image"
          previewType="image"
        />
      </div>
    </div>
  );
};

export default BirdImageComponent;
