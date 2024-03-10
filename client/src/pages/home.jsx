import { MemoizedRenderPosts } from "../components/RenderPosts";
import { CreatePost } from "../components/CreatePost";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SignInComponent } from "../components/SignInComponent";
import { useSetRecoilState } from "recoil";
import { postAtom } from "../store/atoms";

export function Home() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState([]);
    // const [fetchedPosts, setFetchedPosts] = useFetchPosts(1);
    const [userId, setUserId] = useState("");
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const setPostAtom = useSetRecoilState(postAtom);

    const isLoggedInHandler = () => {
        setIsLoggedIn(true);
    };
    // useEffect(() => {
    //     if (fetchedPosts) {
    //         console.log(fetchedPosts);
    //         setPosts(fetchedPosts);
    //     }
    // }, []);

    const fetchSessionData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/user/session",
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                setIsLoggedIn(true);
                setUserId(response.data.userId);
            }
        } catch (error) {
            console.log("User is not authenticated");
        }
    };

    const logoutHandler = async () => {
        try {
            await axios.get("http://localhost:3000/api/user/signout", {
                withCredentials: true,
            });
            setIsLoggedIn(false);
            toast.success("Successfully logged out!");
        } catch (error) {
            console.error(error);
            toast.error("Error occurred while logging out.");
        }
    };

    useEffect(() => {
        fetchSessionData();
    }, [isLoggedIn]);

    const isScrollingToBottom = () => {
        console.log(
            window.innerHeight + document.documentElement.scrollTop ===
                document.documentElement.offsetHeight
        );
        return (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        );
    };

    // useEffect(() => {
    //     if (fetchedPosts) {
    //         setPosts(fetchedPosts);
    //     }
    // }, []);

    // Fetch more posts when user scrolls to the bottom of the page

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
                // setFetchedPosts(page + 1);
                // const newPosts = fetchPosts(page + 1);
                // setPosts((prev) => [...prev, ...fetchedPosts]);
                setPage((prev) => prev + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching, page]);

    // useEffect(() => {
    //     if (isFetching) {
    //         const newPosts = fetchPosts(page);
    //         setPosts((prev) => [...prev, ...newPosts]);
    //         setIsFetching((prev) => !prev);
    //     }
    // }, [isFetching, page]);

    const setPostsHandler = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };
    return (
        <div className="max-w-4xl mx-auto text-wrap text-gray-200">
            <div className="bg-zinc-900 p-5 self-start my-5 rounded flex flex-col items-center justify-center">
                {isLoggedIn ? (
                    <>
                        <button className="bg-zinc-800" onClick={logoutHandler}>
                            Log out
                        </button>
                        <CreatePost setPostsHandler={setPostsHandler} />
                    </>
                ) : (
                    <SignInComponent isLoggedInHandler={isLoggedInHandler} />
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
                (console.log(posts),
                posts.map((post) => (
                    <MemoizedRenderPosts
                        key={post._id}
                        post={post}
                        userId={userId}
                    />
                )))
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
        // console.log("fetched posts", res.data.posts);
        const newPosts = await res.data.posts;
        return newPosts;
    } catch (error) {
        console.error(error);
        return;
    }
}
