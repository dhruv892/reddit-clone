import { MemoizedRenderPosts } from "../components/RenderPosts";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/SessionContext";
import { PostContext } from "../contexts/PostsContex";
import { LoaderComponent } from "../components/LoaderComponent";
import { discardDuplicateItem } from "../util/discardDuplicateItem";
import API_BASE_URL from "../api";

export function Home() {
  // const navigate = useNavigate();

  const { posts, setPosts } = useContext(PostContext);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const { user } = useContext(UserContext);

  const isScrollingToBottom = () => {
    return (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    );
  };

  useEffect(() => {
    (async function () {
      const newPosts = await fetchPosts(page);
      if (newPosts && page === 1) {
        setPosts(newPosts);
        return;
      }
      if (newPosts && isFetching) {
        setPosts((prev) => {
          // console.log(prev);
          return discardDuplicateItem(prev, newPosts);
        });
      }
      setIsFetching(false);
    })();
  }, [isFetching, page, setPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingToBottom() && !isFetching) {
        setIsFetching(true);
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, page]);

  return (
    <div className="max-w-4xl mx-auto mt-16 text-wrap text-gray-200">
      {posts && Object.keys(posts).length !== 0 ? (
        posts.map((post) => (
          <MemoizedRenderPosts
            key={post._id}
            post={post}
            userId={user && user.userId}
          />
        ))
      ) : (
        <LoaderComponent />
      )}
    </div>
  );
}

async function fetchPosts(page) {
  try {
    const res = await axios.get(`${API_BASE_URL}/post/10/${page}`, {
      withCredentials: true,
    });
    const newPosts = await res.data.posts;
    return newPosts;
  } catch (error) {
    console.error(error);
    return;
  }
}
