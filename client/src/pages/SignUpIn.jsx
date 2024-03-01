import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function SignUpIn() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [usernameUp, setUsernameUp] = useState("");
	const [passwordUp, setPasswordUp] = useState("");
	const [errUp, setErrUp] = useState(false);
	const navigate = useNavigate();

	const signUpHandler = async (e) => {
		e.preventDefault();
		setErrUp(false);
		if (!usernameUp || !passwordUp || !firstName || !lastName) return;
		try {
			await axios.post(
				"http://localhost:3000/api/user/signup",
				{
					username: usernameUp,
					firstName: firstName,
					lastName: lastName,
					password: passwordUp,
				},
				{
					withCredentials: true,
				}
			);
			navigate("/");
			console.log(firstName, lastName, usernameUp, passwordUp);
			toast.success("Signed up successfully!");
		} catch (err) {
			console.log(err);
			setErrUp(true);
		}
	};

	return (
		<div className="text-gray-200 max-w-xl mx-auto mt-[10%] bg-zinc-900 p-5">
			<form className="flex flex-col gap-2 " onSubmit={signUpHandler}>
				<h1 className="text-2xl font-bold mb-3">Sign Up</h1>
				<label className="font-medium">First Name</label>
				<input
					type="text"
					className="mb-3"
					name="firstName"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					placeholder="First Name"
				/>
				<label className="font-medium">Last Name</label>
				<input
					type="text"
					className="mb-3"
					name="lastName"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					placeholder="Last Name"
				/>
				<label className="font-medium">Username</label>
				<input
					className="mb-3"
					type="text"
					name="usernameUp"
					value={usernameUp}
					onChange={(e) => setUsernameUp(e.target.value)}
					placeholder="Username"
				/>
				<label className="font-medium">Password</label>
				<input
					className="mb-3"
					type="password"
					name="passwordUp"
					value={passwordUp}
					onChange={(e) => setPasswordUp(e.target.value)}
					placeholder="Password"
				/>
				<input type="submit" value="Sign up" />
			</form>
			{errUp ? <p>Username already exists or something went wrong</p> : null}
		</div>
	);
}
