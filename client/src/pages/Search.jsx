import { useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import moment from "moment";

export function Search() {
    const params = useParams();
    // const navigate = useNavigate();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState([]);
    // const [userId, setUserId] = useState("");
    // const [page, setPage] = useState(1);
    const page = 1;
    const [isFetching, setIsFetching] = useState(false);

    axios.defaults.withCredentials = true;

    // const isScrollingToBottom = () => {
    //     console.log(
    //         window.innerHeight + document.documentElement.scrollTop ===
    //             document.documentElement.offsetHeight
    //     );
    //     return (
    //         window.innerHeight + document.documentElement.scrollTop ===
    //         document.documentElement.offsetHeight
    //     );
    // };

    useEffect(() => {
        (async function () {
            const newPosts = await searchPosts(params.text);
            if (newPosts && page === 1) {
                setPosts(newPosts);
                // setPostAtom(newPosts);
                return;
            }
            if (newPosts && isFetching) {
                setPosts((prev) => [...prev, ...newPosts]);
                setIsFetching((prev) => !prev);
            }
        })();
    }, [isFetching, page, params.text]);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (isScrollingToBottom() && !isFetching) {
    //             setIsFetching(true);
    //             setPage((prev) => prev + 1);
    //         }
    //     };
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, [isFetching, page]);

    // console.log(params.text);
    return (
        <div className="max-w-4xl mx-auto text-wrap text-gray-200 mt-16">
            {posts ? (
                (console.log(posts),
                posts.map((post) => (
                    <div key={post._id} className="flex">
                        <div className="ml-4">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Posted by{" "}
                                    <span className="font-semibold text-gray-100">
                                        {post.author}
                                    </span>{" "}
                                    {moment(parseInt(post.createdAt)).fromNow()}
                                </p>
                                <p className="text-gray-200 text-3xl">
                                    {post.title}
                                </p>
                            </div>

                            <div>
                                <p className="text-justify mt-2 whitespace-pre-line">
                                    {post.content}
                                </p>
                            </div>
                            <br />
                            <div className="flex text-zinc-500">
                                <div>{post.commentCount} comments</div>
                                <div className="ml-2">
                                    {post.votes.upVotes.count -
                                        post.votes.downVotes.count}{" "}
                                    votes
                                </div>
                                {/* <div className="ml-2 hover:bg-zinc-800">
                                    save
                                </div>
                                <div className="ml-2 hover:bg-zinc-800">
                                    ...
                                </div> */}
                            </div>
                            <br />
                        </div>
                    </div>
                )))
            ) : (
                <div>Loading</div>
            )}
        </div>
    );
}

async function searchPosts(text) {
    try {
        const res = await axios.get(
            `http://localhost:3000/api/post/bulk?filter=${text}`
        );
        // console.log("fetched posts", res.data.posts);
        const newPosts = await res.data.posts;
        return newPosts;
    } catch (error) {
        console.error(error);
        return;
    }
}