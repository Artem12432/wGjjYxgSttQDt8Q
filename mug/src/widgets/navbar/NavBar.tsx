import { Link } from "react-router-dom";
import { api } from "../../app/api/api.ts";
import styles from "./NavBar.module.css";

export const NavBar = () => {
        return(
            <div className={styles.Nav}>
                <div className={styles.Logo}>MUG</div>
                <Link to={"/"} className={styles.NavBTN}>Home</Link>
                <Link to={"/Auth"} className={styles.NavBTN}>SignIn / SignUp</Link>
            </div> 
        );
};

  function handleLogout() {
    api.auth.logout();
    window.location.href = "/";
  }

  return (
    <div className={styles.Nav}>
      <Link to={"/"} className={styles.NavBTN}>Home</Link>

      {isLoggedIn ? (
        <button className={styles.NavBTN} onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to={"/Auth"} className={styles.NavBTN}>SignIn / SignUp</Link>
      )}
    </div>
  );
};
