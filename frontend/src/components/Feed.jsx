import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importer useNavigate
import axios from "axios";
import Post from "./Post";
import { AuthContext } from "../context/AuthContext";
import "../styles/Feed.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faComments } from "@fortawesome/free-solid-svg-icons";

function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/posts", {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((res) => setPosts(res.data))
        .catch((err) =>
          console.error("Erreur lors du chargement des posts :", err)
        );
    }
  }, [user]);

  if (!user) {
    return (
      <div className="feed-container">
        <h2 className="restricted-access">
          <FontAwesomeIcon icon={faLock} /> Accès restreint
        </h2>
        <p className="login-prompt">
          Veuillez vous{" "}
          <span className="link" onClick={() => navigate("/login")}>
            connecter
          </span>{" "}
          ou vous{" "}
          <span className="link" onClick={() => navigate("/register")}>
            enregistrer
          </span>{" "}
          pour voir les posts.
        </p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <h2 className="feed-titlee">
        <FontAwesomeIcon icon={faComments} /> Derniers posts
      </h2>
      {posts.length > 0 ? (
        <div className="posts-list">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="no-posts">Aucun post.</p>
      )}
    </div>
  );
}

export default Feed;
