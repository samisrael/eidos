import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import HomeLayoutComponent from "./components/HomelayoutComponent/HomelayoutComponent";
import LandingComponent from "./components/LandingComponent/LandingComponent";
import LoginComponent from "./components/LoginComponent/LoginComponent";
import RegisterComponent from "./components/RegisterComponent/RegisterComponent";
import DashboardComponent from "./components/DashboardComponent/DashboardComponent";
import LogoutComponent from "./components/LogoutComponent/LogoutComponent";
import AnimalPredictionComponent from "./components/AnimalImageComponent/AnimalImageComponent";
import ImageModelsComponent from "./components/ImageModelsComponent/ImageModelsComponent";
import AnimalImageComponent from "./components/AnimalImageComponent/AnimalImageComponent";
import BirdImageComponent from "./components/BirdImageComponent/BirdImageComponent";
import FlowerImageComponent from "./components/FlowerImageComponent/FlowerImageComponent";
import AnimalSoundComponent from "./components/AnimalSoundComponent/AnimalSoundComponent";

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<HomeLayoutComponent />}>
          <Route index element={<LandingComponent />} />
          <Route path="login" element={<LoginComponent />} />
          <Route path="register" element={<RegisterComponent />} />

          <Route path="dashboard" element={<DashboardComponent />}/>
            <Route path="image-prediction" element={<ImageModelsComponent />} />
            <Route path="animal-image" element={<AnimalImageComponent />} />
            <Route path="bird-image" element={<BirdImageComponent />} />
            <Route path="flower-image" element={<FlowerImageComponent />} />
            <Route path="animal-sound" element={<AnimalSoundComponent />} />
            


          <Route path="logout" element={<LogoutComponent />} />
        </Route>
      </Routes>

      </Router>

      <ToastContainer position="top-center" />
    </>
  );
}

export default App;