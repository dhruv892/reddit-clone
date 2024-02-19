import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { refreshPosts } from "../store/atoms";

export function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const setRefreshPosts = useSetRecoilState(refreshPosts);

    const onClickSubmitHandler = async () => {
        try {
            await axios.post(
                `http://localhost:3000/api/post/createPost`,
                {
                    title: title,
                    content: content,
                    createdAt: Date.now().toString(),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            setRefreshPosts((prev) => !prev);
            setTitle("");
            setContent("");
        } catch (error) {
            console.log("Error making POST request", error);
        }
    };
    return (
        <>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />

                <textarea
                    type="text"
                    placeholder="content"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />

                <button onClick={onClickSubmitHandler}>Submit</button>
            </div>
        </>
    );
}
