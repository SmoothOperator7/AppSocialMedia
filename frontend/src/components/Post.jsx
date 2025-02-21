import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Post.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faHeart as faHeartRegular, faTrash } from '@fortawesome/free-solid-svg-icons';

function Post ({ post }) {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [photoDeProfil, setPhotoDeProfil] = useState("/default-avatar.png");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${post.user_id}`)
      .then(res => {
        if (res.data.avatar) {
          setPhotoDeProfil(`http://localhost:5000${res.data.avatar}`);
        }
      })
      .catch(() => setPhotoDeProfil("/default-avatar.png"));

    axios.get(`http://localhost:5000/api/likes/count/${post.id}`)
      .then(res => setLikes(res.data.total_likes || 0))
      .catch(err => console.error("Erreur chargement likes :", err));

    if (user) {
      axios.get(`http://localhost:5000/api/likes/status/${post.id}`, {
          headers: { Authorization: localStorage.getItem("token") }
        })
        .then(res => setLiked(res.data.liked))
        .catch(err => console.error("Erreur statut like :", err));
    }
  }, [post.id, user]);

  const handleLike = async () => {
    if (!user) {
      alert("Veuillez vous connecter pour liker");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/likes", { post_id: post.id }, {
          headers: { Authorization: localStorage.getItem("token") }
        });

      setLiked(!liked);
      setLikes(prev => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Erreur lors du like :", err);
    }
  };

  const handleDelete = async () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post.id}`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
      navigate(0);

    } catch (err) {
      console.error("Erreur lors de la suppression du post :", err);
    } finally {
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <img className="post-avatar" src={photoDeProfil} alt="Avatar" />
        <Link to={`/profil/${post.user_id}`} className="post-username">
          <h3>{post.username}</h3>
        </Link>
      </div>

      <p className="post-content">{post.content}</p>
      {post.image && <img src={post.image} alt="Post" className="post-image" />}

      <div className="post-footer">
        <button className={`like-button ${liked ? "liked" : ""}`} onClick={handleLike}>
          <FontAwesomeIcon icon={liked ? faHeartSolid : faHeartRegular} /> {likes}
        </button>

        {user && user.id === post.user_id && (
          <button className="delete-button" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} /> Supprimer
          </button>
        )}
      </div>

      {showConfirmDelete && (
        <div className="confirm-delete">
          <p>Voulez-vous vraiment supprimer ce post ?</p>
          <button onClick={confirmDelete} className="confirm-button">Oui</button>
          <button onClick={() => setShowConfirmDelete(false)} className="cancel-button">Annuler</button>
        </div>
      )}
    </div>
  );
};

export default Post;
