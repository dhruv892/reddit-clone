import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../App";

export function NavbarComponent() {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	console.log(user);

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
			<div className="block lg:hidden">
				<button className="flex items-center px-3 py-2 border rounded text-zinc-200 border-teal-400 hover:text-white hover:border-white">
					<svg
						className="fill-current h-3 w-3"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</button>
			</div>
			<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
				<div className="text-sm lg:flex-grow">
					{/* <a
						href="#responsive-header"
						className="block mt-4 lg:inline-block lg:mt-0 text-zinc-200 hover:text-white mr-4"
					>
						Docs
					</a>
					<a
						href="#responsive-header"
						className="block mt-4 lg:inline-block lg:mt-0 text-zinc-200 hover:text-white mr-4"
					>
						Examples
					</a>
					<a
						href="#responsive-header"
						className="block mt-4 lg:inline-block lg:mt-0 text-zinc-200 hover:text-white"
					>
						Blog
					</a> */}
				</div>
				<div className="text-gray-200 text-xl">{user && user.username}</div>
			</div>
		</nav>
	);
}
