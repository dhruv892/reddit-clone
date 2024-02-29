import { RenderPosts } from "../components/RenderPosts";
import { CreatePost } from "../components/CreatePost";
import { useRecoilValue, useRecoilRefresher_UNSTABLE } from "recoil";
import { refreshPosts, fetchPost } from "../store/atoms";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useRecoilValueLoadable } from "recoil";
import { postAtom } from "../store/atoms";
import { SignInComponent } from "../components/SignInComponent";

export function Home() {
	const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
	const refresh = useRecoilValue(refreshPosts);
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [posts, setPosts] = useState([]);
	// const [posts, setPosts] = useState([]);
	// const [userId, setUserId] = useState("");

	const fetchSessionData = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3000/api/user/session",
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				setIsLoggedIn(true);
				// setUserId(response.data.userId);
			}
		} catch (error) {
			console.log("User is not authenticated");
		}
	};

	const logoutHandler = async () => {
		try {
			await axios.get("http://localhost:3000/api/user/signout", {
				withCredentials: true,
			});
			setIsLoggedIn(false);
			toast.success("Successfully logged out!");
		} catch (error) {
			console.error(error);
			toast.error("Error occurred while logging out.");
		}
	};

	const postsLoadable = useRecoilValueLoadable(postAtom);

	useEffect(() => {
		refreshPostsAtom();
		fetchSessionData();
	}, [refresh, refreshPostsAtom, isLoggedIn]);

	useEffect(() => {
		if (postsLoadable.state === "hasValue") {
			setPosts(postsLoadable.contents);
		}
	}, [postsLoadable]);

	const setPostsHandler = (newPost) => {
		setPosts((prev) => [...prev, newPost]);
	};

	switch (postsLoadable.state) {
		case "hasValue":
			return (
				<div className="max-w-4xl mx-auto text-wrap text-gray-200">
					<div className="bg-zinc-900 p-10 self-start my-5 rounded flex flex-col items-center justify-center">
						{isLoggedIn ? (
							<CreatePost setPostsHandler={setPostsHandler} />
						) : (
							<SignInComponent />
						)}
						{!isLoggedIn ? (
							<div className="mt-5 flex flex-col">
								<p>Not registered? Sign up below!</p>
								<button
									className="bg-zinc-800 mt-2"
									onClick={() => {
										navigate("/signUpIn");
									}}
								>
									Sign Up
								</button>
							</div>
						) : (
							<button onClick={logoutHandler}>Log out</button>
						)}
					</div>
					{posts.map((post) => (
						<RenderPosts key={post._id} post={post} />
					))}
				</div>
			);

		case "loading":
			return <div>Loading...</div>;
		case "hasError":
			return <div>Error: {postsLoadable.contents.message}</div>;
		default:
			return null;
	}
}
