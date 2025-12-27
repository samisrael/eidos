import React, { useEffect } from "react";
import "./DashboardComponent.css";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaImage, FaMusic } from "react-icons/fa";

const DashboardComponent = () => {
  const navigate = useNavigate();

  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth) : null;

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access dashboard");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-main">
        <h1>Dashboard</h1>
        <Link to="/logout" className="logout-button">
          Logout
        </Link>
      </header>

      {/* Dashboard cards */}
      <section className="model">
        <Card className="model-card">
          <div className="model-card-img">
            <FaImage className="model-card-icon" />
          </div>

          <Card.Body>
            <Card.Title>Image Models</Card.Title>
            <Card.Text>
              Animal, Bird and Flower image classification using deep learning
              models.
            </Card.Text>

            <Button onClick={() => navigate("/image-prediction")}>
              Take me there
            </Button>
          </Card.Body>
        </Card>

        <Card className="model-card">
          <div className="model-card-img">
            <FaMusic className="model-card-icon" />
          </div>

          <Card.Body>
            <Card.Title>Audio Models</Card.Title>
            <Card.Text>
              Animal and Bird audio classification using deep learning models.
            </Card.Text>
            <Button onClick={() => navigate("/animal-sound")}>
              Take me there
            </Button>
          </Card.Body>
        </Card>
      </section>

    </div>
  );
};

export default DashboardComponent;
