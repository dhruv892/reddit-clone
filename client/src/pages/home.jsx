import { MemoizedRenderPosts } from "../components/RenderPosts";
import { CreatePost } from "../components/CreatePost";
import { useRecoilValue } from "recoil";
import { allPosts } from "../store/atoms";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import { useRecoilValueLoadable } from "recoil";
import { useFechMorePosts } from "../store/atoms";
import { SignInComponent } from "../components/SignInComponent";
// import { use } from "../../../server/routes";
// import { use } from "../../../server/routes";

export function Home() {
    // for infinite scrolling feature
    // const nPosts = 10;
    // const [currPage, setCurrPage] = useState(1);
    const fetchedPosts = useRecoilValue(allPosts);
    // const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
    // const fetchedPosts = useRecoilValue(fetchPost(currPage));
    // const refresh = useRecoilValue(refreshPosts);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const fetchMorePosts = useFechMorePosts();

    // const [posts, setPosts] = useState([]);
    // const [userId, setUserId] = useState("");
    const isLoggedInHandler = () => {
        setIsLoggedIn(true);
    };
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

    // const postsLoadable = useRecoilValueLoadable(postAtom);

    useEffect(() => {
        // const newPosts = fetchedPosts;
        // setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        // fetchMorePosts();
        fetchSessionData();
    }, [isLoggedIn]);

    const isScrollingToBottom = () => {
        return (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        );
    };

    // Effect to handle the scroll event
    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingToBottom() && !isFetching) {
                setIsFetching(true);
                fetchMorePosts(); // Fetch more posts
            }
        };

        // Add and remove the scroll event listener
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching, fetchMorePosts]);

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, [currPage]);

    // Effect to reset isFetching when posts are updated
    useEffect(() => {
        if (isFetching) {
            setIsFetching(false);
        }
    }, [posts, isFetching]);

    // useEffect(() => {
    //     if (postsLoadable.state === "hasValue") {
    //         const newPosts = postsLoadable.contents;
    //         setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    //     }
    // }, [postsLoadable]);

    const setPostsHandler = (newPost) => {
        setPosts((prev) => [...prev, newPost]);
    };

    // switch (postsLoadable.state) {
    //     case "hasValue":
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
            {fetchedPosts.map((post) => (
                <MemoizedRenderPosts
                    key={post._id}
                    post={post}
                    userId={userId}
                />
            ))}
        </div>
    );

    // case "loading":
    //     return <div>Loading...</div>;
    // case "hasError":
    //     return <div>Error: {postsLoadable.contents.message}</div>;
    // default:
    //     return null;
    // }
}

// function useFetchPosts(page) {
//     return ()=>useRecoilValue(fetchPost(page));
// }
