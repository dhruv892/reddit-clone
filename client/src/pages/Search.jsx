import { useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { discardDuplicateItem } from "../util/discardDuplicateItem";
import { LoaderComponent } from "../components/LoaderComponent";
import { useNavigate } from "react-router";

export function Search() {
    const param = useParams();
    const navigate = useNavigate();

    const [text, setText] = useState(param.text);

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        setText(param.text);
        setPage(1);
        setIsFetching(false);
        setPosts([]);
    }, [param.text]);

    useEffect(() => {
        (async function () {
            const newPosts = await searchPosts(text, page);
            if (newPosts && page === 1) {
                setPosts(newPosts);
                return;
            }
            if (newPosts && isFetching) {
                setPosts((prev) => {
                    return discardDuplicateItem(prev, newPosts);
                });

                setIsFetching((prev) => !prev);
            }
        })();
    }, [isFetching, page, text]);

    const isScrollingToBottom = () => {
        return (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        );
    };

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
        <div className="max-w-4xl mx-auto text-wrap text-gray-200 mt-16">
            {posts && Object.keys(posts).length !== 0 ? (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-zinc-900 mb-4 p-4 rounded-lg flex gap-1 hover:bg-zinc-700 cursor-pointer"
                        onClick={() => navigate(`/post/${post._id}`)}
                    >
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
                            </div>
                            <br />
                        </div>
                    </div>
                ))
            ) : (
                <LoaderComponent />
            )}
        </div>
    );
}

async function searchPosts(text, page) {
    try {
        console.log(page);
        const res = await axios.get(
            `https://red-srv.darshanv.dev/api/post/bulk?filter=${text}&currPage=${page}`
        );
        console.log("fetched posts", res.data.posts);
        const newPosts = await res.data.posts;
        return newPosts;
    } catch (error) {
        console.error(error);
        return;
    }
}
