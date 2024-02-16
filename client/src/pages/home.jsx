import Post from "../components/post";
import { CreatePost } from "../components/CreatePost";
import { useState, useEffect } from "react";
import axios from "axios";

export function Home() {
    const [posts, setPosts] = useState([]);
    const [refreshPosts, setRefreshPosts] = useState(false);

    const handleRefreshPosts = () => {
        setRefreshPosts(!refreshPosts);
    };

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:3000/posts");
            setPosts(res.data.posts);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, [refreshPosts]);

    return (
        <>
            <CreatePost handleRefreshPosts={handleRefreshPosts} />
            {posts.map(
                (post) => (
                    console.log(post._id),
                    (
                        <Post
                            key={post._id}
                            post={post}
                            handleRefreshPosts={handleRefreshPosts}
                        />
                    )
                )
            )}
        </>
    );
}
