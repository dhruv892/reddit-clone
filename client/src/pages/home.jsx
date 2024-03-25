import { MemoizedRenderPosts } from "../components/RenderPosts";
import { CreatePost } from "../components/CreatePost";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SignInComponent } from "../components/SignInComponent";
import { useSetRecoilState } from "recoil";
import { postAtom } from "../store/atoms";
import { UserContext } from "../contexts/SessionContext";

export function Home() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const setPostAtom = useSetRecoilState(postAtom);

    const { isLoggedIn, user } = useContext(UserContext);

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
                setPostAtom(newPosts);
                return;
            }
            if (newPosts && isFetching) {
                setPosts((prev) => [...prev, ...newPosts]);
                setPostAtom((prev) => [...prev, ...newPosts]);
                setIsFetching((prev) => !prev);
            }
        })();
    }, [isFetching, page, setPostAtom]);

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

    const setPostsHandler = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };
    return (
        <div className="max-w-4xl mx-auto mt-16 text-wrap text-gray-200">
            <div className="bg-zinc-900 p-5 self-start my-5 rounded flex flex-col items-center justify-center">
                {isLoggedIn ? (
                    <CreatePost setPostsHandler={setPostsHandler} />
                ) : (
                    <SignInComponent />
                )}
                {!isLoggedIn && (
                    <div className="mt-5 flex flex-col">
                        <p>Dont have an account? Sign up below!</p>
                        <button
                            className="bg-zinc-800 mt-2"
                            onClick={() => {
                                navigate("/signUpIn");
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
            {posts ? (
                posts.map((post) => (
                    <MemoizedRenderPosts
                        key={post._id}
                        post={post}
                        userId={user && user.userId}
                    />
                ))
            ) : (
                <div>Loading</div>
            )}
        </div>
    );
}

async function fetchPosts(page) {
    try {
        const res = await axios.get(
            `http://localhost:3000/api/post/10/${page}`
        );
        const newPosts = await res.data.posts;
        return newPosts;
    } catch (error) {
        console.error(error);
        return;
    }
}
