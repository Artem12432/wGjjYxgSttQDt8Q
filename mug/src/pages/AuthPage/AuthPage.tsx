import styles from "./AuthPage.module.css"

export const AuthPage = () => {
    return(
        <div className={styles.LogInrotationcontainer}>
            <div className={styles.BGImages}></div>
            <div className={styles.LogIncontainer}>
                <input type="text" className={styles.LogInNamepaaword} placeholder="Name"/><br/>
                <input type="password" className={styles.LogInNamepaaword} placeholder="Password"/><br/>
                <button className={styles.LogInbutton}>LogIn</button>
            </div>
        </div>
    )
};
