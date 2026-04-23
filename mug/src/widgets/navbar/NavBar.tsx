import { Link } from "react-router-dom";
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

