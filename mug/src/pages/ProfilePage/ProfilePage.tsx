import styles from "./ProfilePage.module.css";
import { PinsFolder } from "./PinsFolder/PinsFolder";
import { api } from "../../app/api/api";
import type { User } from "../../app/api/api";
import { useEffect, useState } from "react";

export const ProfilePage = () => {
    const [User, setUser] = useState<User | null>(null);

    useEffect(() => {
      api.auth.me() .then(setUser)
    }, []);

    return (   
        <div className={styles.FullPage}>
            <div className={styles.IMGInfoContent}>
            <div className={styles.ProfileIMG}></div>
                <div className={styles.ProfileInfoContent}>
                    <div className={styles.ProfileInfo}>
                        <h1>Name: {User?.name}</h1>
                        <p>Email: {User?.email}</p>
                    </div>
                    <div className={styles.ProfileContent}>
                        <h2>About Me</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur commodo.</p>
                    </div>
                    <div>
                        <h2>Posts</h2>
                        {User?.posts?.length ? (
                            <ul>
                            {User.posts.map((post) => (
                                <li key={post.id}>
                                  <h3>{post.title}</h3>
                                </li>
                            ))}
                            </ul>
                            ) : (
                                <p>No posts yet</p>
                            )}
                    </div>
                </div>
            </div>
            <div className={styles.ProfilePins }>
                <PinsFolder />
            </div>
        </div>
    );
}
