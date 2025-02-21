import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // hook de navigation React Router

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserProfil(decoded.id, token);
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        logout(); // Supprime le token invalide
      }
    }
  }, []);

  const fetchUserProfil = async (userId, token) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser({
        id: userId,
        username: res.data.username,
        email: res.data.email,
        avatar: res.data.avatar
      });
    } catch (err) {
      console.error("Erreur chargement du profil :", err);
      logout();
    }
  };

  const login = async (userData) => {
    if (typeof userData === "string") {
      localStorage.setItem("token", userData);
      try {
        const decoded = jwtDecode(userData);
        fetchUserProfil(decoded.id, userData);
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    } else {
      setUser(userData);
    }
  };

  const logout = () => {
    console.log("Déconnexion...");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
