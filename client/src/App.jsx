import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import HomeLayoutComponent from "./components/HomelayoutComponent/HomelayoutComponent";
import LandingComponent from "./components/LandingComponent/LandingComponent";
import LoginComponent from "./components/LoginComponent/LoginComponent";
import RegisterComponent from "./components/RegisterComponent/RegisterComponent";
import DashboardComponent from "./components/DashboardComponent/DashboardComponent";
import LogoutComponent from "./components/LogoutComponent/LogoutComponent";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeLayoutComponent />}>
            <Route index element={<LandingComponent />} />
            <Route path="login" element={<LoginComponent />} />
            <Route path="register" element={<RegisterComponent />} />
            <Route path="dashboard" element={<DashboardComponent />} />
            <Route path="logout" element={<LogoutComponent />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
