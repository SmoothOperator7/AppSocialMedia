import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Profil.css";

function UserProfil () {
  const { id } = useParams(); // recupere l'ID depuis l'URL
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // recuperer les informations de l'utilisateur
    axios.get(`http://localhost:5000/api/users/${id}`)
      .then(res => setUserData(res.data))
      .catch(err => console.error("Erreur chargement utilisateur :", err));

    // recuperer les posts de l'utilisateur
    axios.get(`http://localhost:5000/api/posts`)
      .then(res => {
        const userPosts = res.data.filter(post => post.user_id.toString() === id);
        setPosts(userPosts);
      })
      .catch(err => console.error("Erreur chargement posts :", err));
  }, [id]);

  if (!userData) return <h2>Chargement du profil...</h2>;

  return (
    <div className="profil-container">
      <h2>Profil de {userData.username}</h2>
      <img className="avatar" src={`http://localhost:5000${userData.avatar}`} alt="Avatar" />

      <h3>Ses posts</h3>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="user-post">
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>Cet utilisateur n'a pas encore publié de post.</p>
      )}
    </div>
  );
};

export default UserProfil;

