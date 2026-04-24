import { useEffect, useState } from "react";
import { postsApi } from "../../app/api/api";
import type { Post } from "../../app/api/api";

export const TestPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await postsApi.getAll();
      setPosts(data);
    };

    load();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>author: {post.user?.name}</p>
          {post.tags?.map((t) => (
            <p>{t.tag.name}</p>
          ))}
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} />
          )}
        </div>
      ))}
    </div>
  );
};
