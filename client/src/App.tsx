import { Routes, Route } from "react-router-dom";
import Onboarding from "./page/Onboarding";
import ChatPage from "./page/Chat";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
};

export default AppRoutes;
