import React, { useEffect } from "react";
import "./ImageModelsComponent.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

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
    <div className="dashboard-container">
      <header className="dashboard-main">
        <h1>Image Models</h1>
      </header>

      <section className="model">
        {/* Animal Image Model */}
        <Card className="model-card">
          <div className="model-card-img">
            <img
              src="/src/assets/animalimagemodel.png"
              alt="Animal Image Model"
              className="model-card-image"
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

        {/* Bird Image Model */}
        <Card className="model-card">
          <div className="model-card-img">
            <img
              src="/src/assets/birdimagemodel.png"
              alt="Bird Image Model"
              className="model-card-image"
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

        {/* Flower Image Model */}
        <Card className="model-card">
          <div className="model-card-img">
            <img
              src="/src/assets/flowerimagemodel.png"
              alt="Flower Image Model"
              className="model-card-image"
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
  );
};

export default ImageModelsComponent;
