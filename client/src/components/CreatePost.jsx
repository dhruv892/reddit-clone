import { useState, useContext } from "react";
import axios from "axios";
import { PostContext } from "../contexts/PostsContex";
import PropTypes from "prop-types";

export function CreatePost({ addClickedHandler }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const { setPosts } = useContext(PostContext);

    const onClickSubmitHandler = async () => {
        try {
            const res = await axios.post(
                `https://red-srv.darshanv.dev/api/post/createPost`,
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
            // console.log(res.data.post);
            setPosts((prev) => [res.data.post, ...prev]);
            setTitle("");
            setContent("");
            addClickedHandler();
        } catch (error) {
            console.log("Error making POST request", error);
        }
    };
    return (
        <>
            <div className="bg-zinc-900 p-5 self-start my-5 rounded flex flex-col items-center justify-center text-white">
                <p className="text-xl bold my-5 ">Add Post</p>
                <div className="flex flex-col min-w-[70%] gap-2">
                    <input
                        className="bg-zinc-800 placeholder:text-zinc-500 p-2 rounded-lg"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                    <textarea
                        className="bg-zinc-800 placeholder:text-zinc-500 p-2 rounded-lg min-h-[50%]"
                        type="text"
                        placeholder="content"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                    />
                    <button
                        className="p-3 flex-initial rounded-lg bg-zinc-700"
                        onClick={onClickSubmitHandler}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}

CreatePost.propTypes = {
    addClickedHandler: PropTypes.func,
};
