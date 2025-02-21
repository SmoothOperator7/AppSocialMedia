import { useContext } from "react";
import AddPost from "../components/AddPost";
import Feed from "../components/Feed";
import { AuthContext } from "../context/AuthContext";
import '../styles/Home.css';

function Home () {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Accueil (Feed)</h1>
      </header>
      
      <main className="home-main">
        {/* affiche AddPost uniquement si l'utilisateur est connecté */}
        {user ? (
          <AddPost />
        ) : (
          <p className="home-message">Connectez-vous ou Enregistrez-vous pour publier un post.</p>
        )}

        <Feed />
      </main>
    </div>
  );
};

export default Home;
