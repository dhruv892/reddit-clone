import Posts from "../components/Posts";
import { CreatePost } from "../components/CreatePost";
import { useRecoilValue, useRecoilRefresher_UNSTABLE } from "recoil";
import { refreshPosts, fetchPost } from "../store/atoms";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
    const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
    const refresh = useRecoilValue(refreshPosts);
    const navigate = useNavigate();

    useEffect(() => {
        refreshPostsAtom();
    }, [refresh, refreshPostsAtom]);

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
            <Posts />
        </>
    );
}
