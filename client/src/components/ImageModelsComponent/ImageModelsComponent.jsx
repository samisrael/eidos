import React, { useEffect } from "react";
import "./ImageModelsComponent.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import DarkVeil from "../DarkVeil/DarkVeil";

const ImageModelsComponent = () => {
  const navigate = useNavigate();

  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth) : null;

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access image models");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="image-models-root">
      {/* DarkVeil background */}
      <div className="image-models-bg">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0.05}
          scanlineIntensity={0.15}
          scanlineFrequency={2.5}
          warpAmount={0.15}
          speed={0.4}
        />
      </div>

      {/* Foreground */}
      <div className="image-models-container">
        <header className="image-models-header">
          <h1>Image Models</h1>
        </header>

        <section className="image-models-grid">
          <Card className="image-model-card">
            <div className="image-model-card-img">
              <img
                src="/src/assets/animalimagemodel.png"
                alt="Animal Image Model"
                className="image-model-card-image"
              />
            </div>

            <Card.Body>
              <Card.Title>Animal Image Model</Card.Title>
              <Card.Text>
                Animal image classification using deep learning models.
              </Card.Text>
              <Button onClick={() => navigate("/animal-image")}>
                Take me there
              </Button>
            </Card.Body>
          </Card>

          <Card className="image-model-card">
            <div className="image-model-card-img">
              <img
                src="/src/assets/birdimagemodel.png"
                alt="Bird Image Model"
                className="image-model-card-image"
              />
            </div>

            <Card.Body>
              <Card.Title>Bird Image Model</Card.Title>
              <Card.Text>
                Bird image classification using deep learning models.
              </Card.Text>
              <Button onClick={() => navigate("/bird-image")}>
                Take me there
              </Button>
            </Card.Body>
          </Card>

          <Card className="image-model-card">
            <div className="image-model-card-img">
              <img
                src="/src/assets/flowerimagemodel.png"
                alt="Flower Image Model"
                className="image-model-card-image"
              />
            </div>

            <Card.Body>
              <Card.Title>Flower Image Model</Card.Title>
              <Card.Text>
                Flower image classification using deep learning models.
              </Card.Text>
              <Button onClick={() => navigate("/flower-image")}>
                Take me there
              </Button>
            </Card.Body>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ImageModelsComponent;
