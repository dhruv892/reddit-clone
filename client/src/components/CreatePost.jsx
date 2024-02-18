import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { refreshPosts } from "../store/atoms";

export function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const setRefreshPosts = useSetRecoilState(refreshPosts);

    const onClickSubmitHandler = async () => {
        try {
            await axios.post(
                `http://localhost:3000/api/post/createPost`,
                {
                    title: title,
                    content: content,
                    author: author,
                    createdAt: Date.now().toString(),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setRefreshPosts((prev) => !prev);
            setTitle("");
            setContent("");
            setAuthor("");
        } catch (error) {
            console.error("Error making POST request", error.message);
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

                <input
                    type="text"
                    placeholder="author"
                    value={author}
                    onChange={(e) => {
                        setAuthor(e.target.value);
                    }}
                />
                <button onClick={onClickSubmitHandler}>Submit</button>
            </div>
        </>
    );
}
