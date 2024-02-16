export function SignUpIn() {
	return (
		<>
			<div>
				<form>
					<h1>Sign Up</h1>
					<div>
						<label>Username</label>
						<input type="text" placeholder="Username" />
					</div>
					<div>
						<label>Password</label>
						<input type="password" placeholder="Username" />
					</div>
					<input type="submit" value="Sign up" />
				</form>
			</div>

			<div>
				<form>
					<h1>Sign In</h1>
					<div>
						<label>Username</label>
						<input type="text" placeholder="Username" />
					</div>
					<div>
						<label>Password</label>
						<input type="password" placeholder="Username" />
					</div>
					<input type="submit" value="Sign in" />
				</form>
			</div>
		</>
	);
}
