import { atom, waitForNone } from "recoil";
import { selector, selectorFamily } from "recoil";
import { useSetRecoilState } from "recoil";
import axios from "axios";

const currPage = atom({
    key: "fetchMorePosts",
    default: 1,
});

export function useFechMorePosts() {
    const setPage = useSetRecoilState(currPage);
    return () => setPage((prev) => prev + 1);
}

export const fetchPost = selectorFamily({
    key: "fetchPost",
    get: (page) => async () => {
        // const cp = get(currPage);
        const res = await axios.get(
            `http://localhost:3000/api/post/10/${page}`
        );
        if (res.error) {
            throw res.error;
        }
        console.log(res.data);
        return res.data.posts;
    },
});

export const fetchComments = selector({
    key: "fetchComments",
    get: async () => {
        try {
            const res = await axios.get(
                "http://localhost:3000/api/post/allComments"
            );
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },
});

export const allPosts = selector({
    key: "allPosts",
    get: ({ get }) => {
        const cp = get(currPage);
        // Create an array of fetchPost selectors with the current page
        const postSelectors = Array.from({ length: cp }, (_, index) =>
            fetchPost({ page: index + 1 })
        );
        const postsLoadables = get(waitForNone(postSelectors));
        // Extract the posts from the loadables
        const allPosts = postsLoadables.map((loadable) => loadable.contents);
        return allPosts.flat();
    },
});
export const postAtom = atom({
    key: "postAtom",
    defualt: fetchPost,
});

export const commentAtom = atom({
    key: "commentAtom",
    default: fetchComments,
});
// export const commentRefsAtom = atom({
//     key: "commentRefsAtom",
//     default: fetchComments.commentRefs,
// });

export const refreshPosts = atom({
    key: "refreshPosts",
    default: false,
});
