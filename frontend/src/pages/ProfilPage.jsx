import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Profil.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function ProfilPage () {
  const { user, login } = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [editing, setEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(user?.avatar || "/default-avatar.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null); //gere l'affichage de la confirmation de suppression
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/users/${user.id}`, {
        headers: { Authorization: localStorage.getItem("token") } 
      })      
      .then(res => {
        setAvatar(res.data.avatar || "/default-avatar.png");
        login({ ...user, email: res.data.email, avatar: res.data.avatar });
      })
      .catch(err => console.error("Erreur chargement avatar/email :", err));

      axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: localStorage.getItem("token") } // envoie le token brut
      })
      
      .then(res => {
        const userPosts = res.data.filter(post => post.user_id === user.id);
        setPosts(userPosts);
      })
      .catch(err => console.error("Erreur lors du chargement des posts :", err));
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner une image !");
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const res = await axios.put("http://localhost:5000/api/users/avatar", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data"
        }
      });
      

      setAvatar(res.data.avatar);
      login({ ...user, avatar: res.data.avatar });
      setSelectedFile(null);
      setIsUploadingAvatar(false);
    } catch (err) {
      console.error("Erreur lors de l'upload de l'avatar :", err.response?.data || err);
      setIsUploadingAvatar(false);
    }
  };

  // demander confirmation avant suppression
  const requestDeletePost = (postId) => {
    setPostToDelete(postId);
  };

  // confirmer la suppression d'un post
  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postToDelete}`, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete));
    } catch (err) {
      console.error("Erreur lors de la suppression du post :", err.response ? err.response.data : err);
    } finally {
      setPostToDelete(null);
    }
  };

  // Modification du username
  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      alert("Le nom d'utilisateur ne peut pas être vide.");
      return;
    }

    try {
      const res = await axios.put("http://localhost:5000/api/users/username", 
        { username: newUsername }, 
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      

      console.log("Username mis à jour :", res.data);
      login({ ...user, username: newUsername });
      setEditing(false);
    } catch (err) {
      console.error("Erreur lors de la modification du username :", err.response?.data || err);
    }
  };

  if (!user) {
    return <h2>Veuillez vous connecter pour voir votre profil.</h2>;
  }

  return (
    <div className="profil-container">
      <h2>Profil</h2>
  
      <div className="avatar-container" onClick={() => fileInputRef.current.click()}>
        <img className="avatar" src={`http://localhost:5000${avatar}`} alt="Avatar" />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleAvatarChange}
      />
  
      {selectedFile && !isUploadingAvatar && <button onClick={handleUpload}>Appliquer</button>}
      {user && <p><strong>Email :</strong> {user.email}</p>}
  
      <div className="edit-username">
        {editing ? (
          <>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Modifier votre username"
            />
            {newUsername.trim() && (
              <button onClick={handleUsernameChange}>Appliquer</button>
            )}
            <button
              onClick={() => {
                setNewUsername(user.username);
                setEditing(false);
              }}
              className="cancel-button"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
            <button
              onClick={() => {
                setNewUsername(user.username);
                setEditing(true);
              }}
            >
              Modifier
            </button>
          </>
        )}
      </div>
  
      <h3>Vos posts</h3>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="user-post">
            <p>{post.content}</p>
            <button className="delete-button" onClick={() => requestDeletePost(post.id)}>
              <FontAwesomeIcon icon={faTrash} /> Supprimer
            </button>
  
            {/* Affichage du message de confirmation UNIQUEMENT pour le post sélectionné */}
            {postToDelete === post.id && (
              <div className="confirm-delete">
                <p>Voulez-vous vraiment supprimer ce post ?</p>
                <button onClick={confirmDeletePost} className="confirm-button">Oui</button>
                <button onClick={() => setPostToDelete(null)} className="cancel-button">Annuler</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Aucun post publié.</p>
      )}
    </div>
  );
  
};

export default ProfilPage;
