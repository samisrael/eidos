import React, { useEffect, useState } from "react";
import "./DashboardComponent.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import AnimalPredictionComponent from "../AnimalPredictComponent/AnimalPredictComponent";

const DashboardComponent = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const fetchLuckyNumber = async () => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        "http://localhost:7001/api/v1/dashboard",
        axiosConfig
      );
      setData({ msg: response.data.msg, luckyNumber: response.data.secret });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchLuckyNumber();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <div>
      <div className="dashboard-main">
        <h1>Dashboard</h1>
        <Link to="/logout" className="logout-button">
          Logout
        </Link>
      </div>
      <div className="model">
        <AnimalPredictionComponent />
      </div>
    </div>
  );
};

export default DashboardComponent;
