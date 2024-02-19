import { atom } from "recoil";
import { selector } from "recoil";
import axios from "axios";

export const fetchPost = selector({
    key: "fetchPost",
    get: async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/post/");
            return res.data.posts;
        } catch (error) {
            console.log(error);
        }
    },
});

export const postAtom = atom({
    key: "postAtom",
    default: fetchPost,
});

export const refreshPosts = atom({
    key: "refreshPosts",
    default: false,
});
