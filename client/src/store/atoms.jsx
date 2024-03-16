import { atom } from "recoil";

export const postAtom = atom({
    key: "postAtom",
    defualt: [],
});

export const commentsCount = atom({
    key: "commentsCount",
    defualt: 0,
});

export const refreshPosts = atom({
    key: "refreshPosts",
    default: false,
});
