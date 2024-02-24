import { useParams } from "react-router";
import { postAtom, fetchPost } from "../store/atoms";
import moment from "moment";
import "./PostPage.css";
import AddComment from "../components/AddComment";
import { PostComments } from "../components/PostComments";
import axios from "axios";
import {
    // useRecoilState,
    useRecoilRefresher_UNSTABLE,
    useRecoilValueLoadable,
} from "recoil";
import { useEffect, useState } from "react";
import {
    checkDownVotes,
    checkUpVotes,
    // postVoteHandler,
} from "../util/VotingMethods";
// import { set } from "mongoose";

export function PostPage() {
    const postLoadable = useRecoilValueLoadable(postAtom);
    const params = useParams();
    axios.defaults.withCredentials = true;
    //const [refresh, setRefreshPosts] = useRecoilState(refreshPosts);
    const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState("");
    const [postVotes, setPostVotes] = useState(0);
    const [upVoteUsers, setUpVoteUsers] = useState([]);
    const [downVoteUsers, setDownVoteUsers] = useState([]);

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
    }, [refreshPostsAtom]);
    useEffect(() => {
        fetchSessionData();
    }, [isLoggedIn]);

    useEffect(() => {
        if (postLoadable.state === "hasValue") {
            const post = postLoadable.contents.find((p) => p._id === params.id);
            if (post) {
                const upVotes = post.votes.upVotes.count;
                const downVotes = post.votes.downVotes.count;
                setPostVotes(upVotes - downVotes);
                setUpVoteUsers(post.votes.upVotes.users);
                setDownVoteUsers(post.votes.downVotes.users);
            }
        }
    }, [postLoadable, params.id]);

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
    // const upVotes = post.votes.upVotes.count;
    // const downVotes = post.votes.downVotes.count;
    // // console.log(tempVotes);
    // setPostVotes((prev) => upVotes - downVotes);

    const voteHandler = async (post, voteType) => {
        if (!userId) return;
        console.log(downVoteUsers);
        console.log(upVoteUsers);
        if (voteType === "up" && upVoteUsers.includes(userId)) return;
        if (voteType === "down" && downVoteUsers.includes(userId)) return;

        // const res = await postVoteHandler(post, voteType, userId);
        // // setRefreshPosts((prev) => !prev);
        // console.log(res);

        try {
            const response = await axios.post(
                `http://localhost:3000/api/post/${voteType}vote/${post._id}`
            );
            console.log(response);
            switch (voteType) {
                case "up":
                    downVoteUsers.includes(userId)
                        ? setPostVotes((prev) => prev + 2)
                        : setPostVotes((prev) => prev + 1);
                    setUpVoteUsers((prev) => [...prev, userId]);
                    setDownVoteUsers((prev) =>
                        prev.filter((id) => id !== userId)
                    );
                    break;
                case "down":
                    console.log(userId);
                    // console.log(downVoteUsers);
                    upVoteUsers.includes(userId)
                        ? setPostVotes((prev) => prev - 2)
                        : setPostVotes((prev) => prev - 1);
                    setDownVoteUsers((prev) => {
                        return [...prev, userId];
                        // console.log([...prev, userId]);
                    });
                    setUpVoteUsers((prev) => {
                        return prev.filter((id) => id != userId);
                    });
                    // console.log(downVoteUsers);
                    // post.votes.downVotes.users.push(userId);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
        console.log(downVoteUsers);
        console.log(upVoteUsers);
        // if (res === "done") {
        //     console.log("done");

        // }
    };

    return (
        <div>
            <div className="postpage-wrapper">
                <div className="postpage-score">
                    <button
                        className={checkUpVotes(post, userId)}
                        onClick={() => {
                            // !checkUpVotes(post, userId) &&
                            voteHandler(post, "up");
                        }}
                    >
                        &#11014;️
                    </button>
                    <span>{postVotes}</span>
                    <button
                        className={checkDownVotes(post, userId)}
                        onClick={() =>
                            // !checkDownVotes(post, userId) &&
                            voteHandler(post, "down")
                        }
                    >
                        ️&#11015;
                    </button>
                </div>
                <div className="postpage-title-wrapper">
                    <p className="post-title">{post.title}</p>
                    <p className="post-">
                        {post.author}{" "}
                        {moment(parseInt(post.createdAt)).fromNow()}
                    </p>
                </div>
            </div>
            <pre>
                <p className="post-content">{post.content}</p>
            </pre>

            <AddComment post={post} />
            <h4>Comments</h4>
            {post.comments.length > 0
                ? post.comments.map((comment) => (
                      <PostComments
                          key={comment._id}
                          comment={comment}
                          userId={userId}
                      />
                  ))
                : null}
            {/* <PostComments post={post} userId={userId} /> */}
        </div>
    );
}
