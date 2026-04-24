import { useState } from "react";
import styles from "./CreatePost.module.css";

export const CreatePost = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div className={styles.CreatePostWindget}>
      <div className={styles.PlusForCreate} onClick={toggleVisible}>
        +
      </div>

      {visible && (
        <div className={styles.Layout}>
          <div className={styles.CreatePost}>
            <div className={styles.textup} onClick={toggleVisible}>
              Back
            </div>
            <div className={styles.textup} onClick={toggleVisible}>
              Post
            </div>
          </div>
          <div className={styles.CreatePostContent}>
            <div className={styles.UploadIMG}></div>
            <div className={styles.TextUpload}>
              <input className={styles.PostTitle} type="text" placeholder="Write your post title..." />
              <input className={styles.Comment} type="text" placeholder="Write your comment for post..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};