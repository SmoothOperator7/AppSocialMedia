import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import '../styles/AddPost.css';

function AddPost () {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You need to login");

    try {
      await axios.post("http://localhost:5000/api/posts", 
        { content }, 
        {
          headers: { Authorization: localStorage.getItem("token") }
        }
      );

      navigate(0); // rafraichi la page actuelle

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-post">
      <input
        className="input-add-post"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Entrer votre message..."
        required
      />
      <button type="submit">Envoyer le Post</button>
    </form>
  );
};

export default AddPost;
