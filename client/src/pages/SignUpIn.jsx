import { useState } from "react";

export function SignUpIn() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [usernameUp, setUsernameUp] = useState("");
    const [passwordUp, setPasswordUp] = useState("");
    const [usernameIn, setUsernameIn] = useState("");
    const [passwordIn, setPasswordIn] = useState("");

    const signUpHandler = (e) => {
        e.preventDefault();

        console.log(firstName, lastName, usernameUp, passwordUp);
    };

    const signInHandler = (e) => {
        e.preventDefault();

        console.log(usernameIn, passwordIn);
    };

    return (
        <>
            <div>
                <form onSubmit={signUpHandler}>
                    <h1>Sign Up</h1>
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                        />
                    </div>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            name="usernameUp"
                            value={usernameUp}
                            onChange={(e) => setUsernameUp(e.target.value)}
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="passwordUp"
                            value={passwordUp}
                            onChange={(e) => setPasswordUp(e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <input type="submit" value="Sign up" />
                </form>
            </div>

            <div>
                <form onSubmit={signInHandler}>
                    <h1>Sign In</h1>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            name="usernameIn"
                            value={usernameIn}
                            onChange={(e) => setUsernameIn(e.target.value)}
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="passwordIn"
                            value={passwordIn}
                            onChange={(e) => setPasswordIn(e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <input type="submit" value="Sign in" />
                </form>
            </div>
        </>
    );
}
