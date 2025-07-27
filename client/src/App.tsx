import { Routes, Route } from "react-router-dom";
import Onboarding from "./page/Onboarding";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
    </Routes>
  );
};

export default AppRoutes;
