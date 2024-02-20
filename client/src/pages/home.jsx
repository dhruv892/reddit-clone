import Posts from "../components/Posts";
import { CreatePost } from "../components/CreatePost";
import { useRecoilValue, useRecoilRefresher_UNSTABLE } from "recoil";
import { refreshPosts, fetchPost } from "../store/atoms";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Home() {
	const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
	const refresh = useRecoilValue(refreshPosts);
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

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
				// Now you can redirect the user or perform other actions
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
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		refreshPostsAtom();
		fetchSessionData();
	}, [refresh, refreshPostsAtom, isLoggedIn]);

	return (
		<>
			{!isLoggedIn ? (
				<button
					onClick={() => {
						navigate("/signUpIn");
					}}
				>
					SignUpIn
				</button>
			) : (
				<button onClick={() => logoutHandler()}>Log out</button>
			)}
			<CreatePost />
			<Posts />
		</>
	);
}
