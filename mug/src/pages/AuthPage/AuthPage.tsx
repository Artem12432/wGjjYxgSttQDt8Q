import styles from "./AuthPage.module.css"

export const AuthPage = () => {
    return(
        <div className={styles.LogInrotationcontainer}>
            <div className={styles.LogIncontainer}>
                <input type="text" className={styles.LogInName} placeholder="Name"/><br/>
                <input type="password" className={styles.Password} placeholder="Pass"/><br/>
                <button className={styles.LogInbutton}>LogIn</button>
            </div>
        </div>
    )
};
