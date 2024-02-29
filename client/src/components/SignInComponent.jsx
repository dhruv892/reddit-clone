import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export function SignInComponent() {
	const [usernameIn, setUsernameIn] = useState("");
	const [passwordIn, setPasswordIn] = useState("");
	const [errIn, setErrIn] = useState(false);
	const navigate = useNavigate();

	const signInHandler = async (e) => {
		e.preventDefault();
		setErrIn(false);

		if (!usernameIn || !passwordIn) return;
		try {
			await axios.post(
				"http://localhost:3000/api/user/signin",
				{
					username: usernameIn,
					password: passwordIn,
				},
				{
					withCredentials: true,
				}
			);
			navigate("/");
			toast.success("Logged in successfully!");
			console.log(usernameIn, passwordIn);
		} catch (err) {
			console.log(err);
			setErrIn(true);
		}
	};

	return (
		<div className="text-gray-200 min-w-[40%]">
			<form className="flex flex-col" onSubmit={signInHandler}>
				<p className="text-2xl text-center">Sign In</p>
				<div className="mt-2 flex gap-2 items-center">
					<label className="mb-1">Username</label>
					<input
						type="text"
						name="usernameIn"
						value={usernameIn}
						onChange={(e) => setUsernameIn(e.target.value)}
						placeholder="Username"
					/>
				</div>

				<div className="mt-2 flex gap-2 items-center">
					<label className="mb-1 mr-1">Password</label>
					<input
						type="password"
						name="passwordIn"
						value={passwordIn}
						onChange={(e) => setPasswordIn(e.target.value)}
						placeholder="Password"
					/>
				</div>
				<input className="mt-2" type="submit" value="Sign in" />
			</form>
			{errIn ? <p className="text-">Incorrect username or password</p> : null}
		</div>
	);
}
