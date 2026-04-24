
import { Link } from "react-router-dom";
import { api } from "../../app/api/api.ts";
import styles from "./NavBar.module.css";
import { AccountDropdown } from "../AccountDropdown/AccountDropdown.tsx";

export const NavBar = () => {
  const isLoggedIn = api.auth.isLoggedIn();


  return (
    <div className={styles.Nav}>
      <Link to={"/"} className={styles.NavBTN}>Home</Link>

      <Link to={"/"} className={styles.Logo}>
        MUG
      </Link>

      {isLoggedIn ? (
        <AccountDropdown />
      ) : (
        <Link to={"/Auth"} className={styles.NavBTN}>SignIn / SignUp</Link>
      )}
    </div>
  );
};