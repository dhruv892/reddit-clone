import { useParams } from "react-router";
import {
    postAtom,
    fetchPost,
    commentAtom,
    fetchComments,
} from "../store/atoms";
import moment from "moment";
import AddComment from "../components/AddComment";
import { PostComments } from "../components/PostComments";
import axios from "axios";
import {
    // useRecoilState,
    useRecoilRefresher_UNSTABLE,
    useRecoilValueLoadable,
} from "recoil";
import { useEffect, useState } from "react";

import { VotingComponent } from "../components/VotingComponent";
import { findComments } from "../util/findComments";

export function PostPage() {
    const postLoadable = useRecoilValueLoadable(postAtom);
    const commentLoadable = useRecoilValueLoadable(commentAtom);
    // const commentRefsLoadable = useRecoilValueLoadable(commentRefsAtom);
    const params = useParams();
    axios.defaults.withCredentials = true;
    //const [refresh, setRefreshPosts] = useRecoilState(refreshPosts);
    const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
    const fetchAllComments = useRecoilRefresher_UNSTABLE(fetchComments);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState("");

    const [comments, setComments] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [commentRefs, setCommentRefs] = useState([]);

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

    useEffect(() => {
        refreshPostsAtom();
        fetchAllComments();
    }, [fetchAllComments, refreshPostsAtom]);
    useEffect(() => {
        fetchSessionData();
    }, [isLoggedIn]);

    useEffect(() => {
        if (postLoadable.state === "hasValue") {
            const post = postLoadable.contents.find((p) => p._id === params.id);
            if (post) {
                if (commentLoadable.state === "hasValue") {
                    const fetchedAllComments = commentLoadable.contents;
                    const postComments = findComments(
                        post._id,
                        fetchedAllComments.comments,
                        fetchedAllComments.commentRefs
                    );
                    console.log(postComments);
                    setComments(postComments);
                    setAllComments(fetchedAllComments.comments);
                    setCommentRefs(fetchedAllComments.commentRefs);
                }
                // setComments(post.comments);
            }
        }
    }, [postLoadable, params.id, commentLoadable]);

    let post;

    switch (postLoadable.state) {
        case "hasValue":
            post = postLoadable.contents.find((p) => p._id === params.id);
            break;
        case "loading":
            return <h1>Loading...</h1>;
        case "hasError":
            throw postLoadable.contents;
    }

    // const voteHandler = async (post, voteType) => {
    //     if (!userId) return;
    //     if (voteType === "up" && upVoteUsers.includes(userId)) return;
    //     if (voteType === "down" && downVoteUsers.includes(userId)) return;

    //     const req = await postVoteHandler(post._id, voteType);
    //     // console.log(req);
    //     if (req === "done") {
    //         //     console.log("done");
    //         switch (voteType) {
    //             case "up":
    //                 downVoteUsers.includes(userId)
    //                     ? setPostVotes((prev) => prev + 2)
    //                     : setPostVotes((prev) => prev + 1);
    //                 setUpVoteUsers((prev) => [...prev, userId]);
    //                 setDownVoteUsers((prev) =>
    //                     prev.filter((id) => id !== userId)
    //                 );
    //                 break;
    //             case "down":
    //                 console.log(userId);
    //                 // console.log(downVoteUsers);
    //                 upVoteUsers.includes(userId)
    //                     ? setPostVotes((prev) => prev - 2)
    //                     : setPostVotes((prev) => prev - 1);
    //                 setDownVoteUsers((prev) => {
    //                     return [...prev, userId];
    //                     // console.log([...prev, userId]);
    //                 });
    //                 setUpVoteUsers((prev) => {
    //                     return prev.filter((id) => id != userId);
    //                 });
    //                 // console.log(downVoteUsers);
    //                 // post.votes.downVotes.users.push(userId);
    //                 break;
    //         }
    //     } else {
    //         console.log(req);
    //     }
    // };

    const setCommentsHandler = (newComment) => {
        setComments((prev) => [...prev, newComment]);
    };

    return (
        <div className="mt-5 p-5 max-w-4xl mx-auto text-wrap text-gray-300 bg-zinc-900 pr-6">
            <div className="flex">
                <div className="flex flex-col mr-2 flex-initial align-center gap-1">
                    {/* <button
                        className="p-0"
                        onClick={() => {
                            // !checkUpVotes(post, userId) &&
                            voteHandler(post, "up");
                        }}
                    >
                        <UpVoteLogo />
                    </button>
                    <span className="text-center">{postVotes}</span>
                    <button
                        className="p-0"
                        onClick={() =>
                            // !checkDownVotes(post, userId) &&
                            voteHandler(post, "down")
                        }
                    >
                        <DownVoteLogo />
                    </button> */}
                    <VotingComponent
                        votes={post.votes}
                        userId={userId}
                        type={"post"}
                        itemId={post._id}
                    />
                </div>
                <div className="ml-4">
                    <div>
                        <p className="text-gray-400 text-sm">
                            Posted by{" "}
                            <span className="font-semibold text-gray-100">
                                {post.author}
                            </span>{" "}
                            {moment(parseInt(post.createdAt)).fromNow()}
                        </p>
                        <p className="text-gray-200 text-3xl">{post.title}</p>
                    </div>

                    <div>
                        <p className="text-justify mt-2 whitespace-pre-line">
                            {post.content}
                        </p>
                    </div>
                    <br />
                    <div className="flex text-zinc-500">
                        <div>{comments.length} comments</div>
                        <div className="ml-2 hover:bg-zinc-800">share</div>
                        <div className="ml-2 hover:bg-zinc-800">save</div>
                        <div className="ml-2 hover:bg-zinc-800">...</div>
                    </div>
                    <br />
                </div>
            </div>

            <div className="bg-zinc-900 rounded-lg">
                <AddComment
                    id={post._id.toString()}
                    setCommentsHandler={setCommentsHandler}
                />
                <p className="text-2xl pl-4">Comments</p>
                <div className="divide-y divide-slate-50 py-2">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <PostComments
                                key={comment._id}
                                comment={comment}
                                userId={userId}
                                allComments={allComments}
                                commentRefs={commentRefs}
                            />
                        ))
                    ) : (
                        <p className="ml-4 mt-2 font-bold">No Comments yet</p>
                    )}
                </div>
            </div>
            {/* <PostComments post={post} userId={userId} /> */}
        </div>
    );
}
