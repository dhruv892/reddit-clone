import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../contexts/SessionContext";
import { toast } from "react-toastify";
import axios from "axios";

export function NavbarComponent() {
	const navigate = useNavigate();
	const { user, setIsLoggedIn } = useContext(UserContext);
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

	return (
		<nav className="flex items-center justify-between flex-wrap bg-zinc-800 p-3">
			<div className="flex items-center flex-shrink-0 text-white mr-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Reddit"
					role="img"
					viewBox="0 0 512 512"
					width="44"
					height="44"
				>
					<rect width="512" height="512" rx="15%" fill="#f40" />

					<g fill="#ffffff">
						<ellipse cx="256" cy="307" rx="166" ry="117" />

						<circle cx="106" cy="256" r="42" />

						<circle cx="407" cy="256" r="42" />

						<circle cx="375" cy="114" r="32" />
					</g>

					<g strokeLinecap="round" strokeLinejoin="round" fill="none">
						<path d="m256 196 23-101 73 15" stroke="#ffffff" strokeWidth="16" />

						<path
							d="m191 359c33 25 97 26 130 0"
							stroke="#f40"
							strokeWidth="13"
						/>
					</g>

					<g fill="#f40">
						<circle cx="191" cy="287" r="31" />

						<circle cx="321" cy="287" r="31" />
					</g>
				</svg>
				<span
					onClick={() => navigate("/")}
					className="font-semibold text-xl tracking-tight ml-2 cursor-pointer"
				>
					Reddit
				</span>
			</div>
			{user && (
				<div>
					<span className="text-gray-200 text-xl">{user.username}</span>
					<button
						className="inline-block ml-5 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white mt-4 lg:mt-0"
						onClick={logoutHandler}
					>
						Log out
					</button>
				</div>
			)}
		</nav>
	);
}
