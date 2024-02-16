import { atom } from "recoil";
import { selector } from "recoil";
import axios from "axios";

export const postAtom = atom({
	key: "postAtom",
	// default: [],
	default: selector({
		key: "fetchPost",
		get: async () => {
			try {
				const res = await axios.get("http://localhost:3000/posts");
				return res.data.posts;
			} catch (error) {
				console.log(error);
			}
		},
	}),
});
