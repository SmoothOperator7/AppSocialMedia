import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import '../styles/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse , faCircleUser , faSignOutAlt , faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
function Navbar () {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
    <Link to="/">
      <div className="home-accueil"><FontAwesomeIcon icon={faHouse} /></div>
       Accueil 
      </Link>
      {user ? (
        <>    
          <Link to="/profil">
          <div className="home-profil"><FontAwesomeIcon icon={faCircleUser} /> </div>
          Mon Profil 
          </Link>
          <button onClick={logout}> <div className="home-logout"><FontAwesomeIcon icon={faSignOutAlt} /></div> Se déconnecter</button>
        </>
      ) : (
        <>
          <Link to="/login"> <div className="home-login"><FontAwesomeIcon icon={faSignInAlt} /></div> Se connecter</Link>
          <Link to="/register"><div className="home-register"><FontAwesomeIcon icon={faUserPlus} /></div> S'enregistrer</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
