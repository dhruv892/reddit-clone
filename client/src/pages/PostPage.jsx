import { useParams } from "react-router";
import { postAtom } from "../store/atoms";
import { useRecoilValueLoadable } from "recoil";
import moment from "moment";
import "./PostPage.css";
import AddComment from "../components/AddComment";
import { PostComments } from "../components/PostComments";
import axios from "axios";

export function PostPage() {
    const postLoadable = useRecoilValueLoadable(postAtom);
    const params = useParams();
    axios.defaults.withCredentials = true;

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
    console.log(post);

    const voteHandler = async (post, voteType) => {
        // http://localhost:3000/api/post/upvote/
        switch (voteType) {
            case "up":
                try {
                    console.log("XDDDDDDDDD", `${post._id}`);
                    const response = await axios.post(
                        `http://localhost:3000/api/post/upvote/${post._id}`
                    );
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
                break;
            case "down":
                try {
                    const response = await axios.post(
                        `http://localhost:3000/api/post/downvote/${post._id}`
                    );
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
                break;
        }
        console.log(post, voteType);
    };

    return (
        <div>
            <div className="postpage-wrapper">
                <div className="postpage-score">
                    <button onClick={() => voteHandler(post, "up")}>
                        &#11014;️
                    </button>
                    <span>
                        {post.votes.upVotes.count - post.votes.downVotes.count}
                    </span>
                    <button onClick={() => voteHandler(post, "down")}>
                        ️&#11015;
                    </button>
                </div>
                <p className="post-title">{post.title}</p>
            </div>
            <p className="post-">
                {post.author} {moment(parseInt(post.createdAt)).fromNow()}
            </p>
            <pre>
                <p className="post-content">{post.content}</p>
            </pre>

            <AddComment post={post} />
            <PostComments post={post} />
        </div>
    );
}
