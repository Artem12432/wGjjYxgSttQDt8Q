import { useEffect, useState, useRef } from "react";
import styles from "./HomePage.module.css";
import { images } from "./ImagesRandom";

const BATCH_SIZE = 50;

export const HomePage = () => {
  const [visibleImages, setVisibleImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const shuffled = useRef<string[]>([]);

  useEffect(() => {
    shuffled.current = [...images].sort(() => 0.1 - Math.random());
    loadMore();
  }, []);

  const loadMore = () => {
    const start = (page - 1) * BATCH_SIZE;
    const end = page * BATCH_SIZE;

    const newImages = shuffled.current.slice(start, end);

    if (newImages.length === 0) return;

    setVisibleImages((prev) => [...prev, ...newImages]);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={styles.Page}>
        {visibleImages.map((src, index) => (
          <img
            key={index}
            src={src}
            className={styles.Photo}
            loading="lazy"
            onClick={() => setSelectedImg(src)}
          />
        ))}
      </div>

      <div ref={loaderRef} />

      {selectedImg && (
        <div className={styles.Modal} onClick={() => setSelectedImg(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <img src={selectedImg} className={styles.IMG} />

            <a href={selectedImg} download className={styles.DownloadBtn}>
              Скачать
            </a>
          </div>
        </div>
      )}
    </>
  );
};