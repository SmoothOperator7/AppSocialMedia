import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import ProfilPage from "./pages/ProfilPage";
import UserProfil from "./pages/UserProfil";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/profil/:id" element={<UserProfil />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
