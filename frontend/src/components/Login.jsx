import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login () {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const message = location.state?.message || "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Connexion</h2>
      {message && <p className="info-message">{message}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
