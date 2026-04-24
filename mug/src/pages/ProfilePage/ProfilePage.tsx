import styles from "./ProfilePage.module.css";
import { PinsFolder } from "./PinsFolder/PinsFolder";


export const ProfilePage = () => {
    return (   
        <div className={styles.FullPage}>
            <div className={styles.IMGInfoContent}>
            <div className={styles.ProfileIMG}></div>
                <div className={styles.ProfileInfoContent}>
                    <div className={styles.ProfileInfo}>
                        <h1>asd</h1>
                        <p>Email: asdasd@asd.com</p>
                    </div>
                    <div className={styles.ProfileContent}>
                        <h2>About Me</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur commodo.</p>
                    </div>
            </div>
            </div>
            <div className={styles.ProfilePins }>
                <PinsFolder />
            </div>
        </div>
    );
}