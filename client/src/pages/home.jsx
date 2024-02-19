import Post from "../components/post";
import { CreatePost } from "../components/CreatePost";
import {
    useRecoilValue,
    useRecoilValueLoadable,
    useRecoilRefresher_UNSTABLE,
} from "recoil";
import { postAtom, refreshPosts, fetchPost } from "../store/atoms";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
export function Home() {
    const postsLoadable = useRecoilValueLoadable(postAtom);
    const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
    const refresh = useRecoilValue(refreshPosts);
    const navigate = useNavigate();

    useEffect(() => {
        refreshPostsAtom();
    }, [refresh, refreshPostsAtom]);

    // const SignUpInClickHandler = () => {
    //     navigate("/signupin");
    // };

    switch (postsLoadable.state) {
        case "hasValue":
            return (
                <>
                    <button
                        onClick={() => {
                            navigate("/signUpIn");
                        }}
                    >
                        SignUpIn
                    </button>
                    <CreatePost />
                    {postsLoadable.contents.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </>
            );
        case "loading":
            return <div>Loading...</div>;
        case "hasError":
            return <div>Error: {postsLoadable.contents.message}</div>;
        default:
            return null;
    }
}
