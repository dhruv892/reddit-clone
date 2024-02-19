import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SignUpIn() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [usernameUp, setUsernameUp] = useState("");
    const [passwordUp, setPasswordUp] = useState("");
    const [errUp, setErrUp] = useState(false);
    const [usernameIn, setUsernameIn] = useState("");
    const [passwordIn, setPasswordIn] = useState("");
    const [errIn, setErrIn] = useState(false);
    const navigate = useNavigate();

    const signUpHandler = async (e) => {
        e.preventDefault();
        setErrUp(false);
        if (!usernameUp || !passwordUp || !firstName || !lastName) return;
        await axios
            .post(
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
            )
            .then(() => navigate("/"))
            .catch((err) => {
                console.log(err);
                setErrUp(true);
            });
        console.log(firstName, lastName, usernameUp, passwordUp);
    };

    const signInHandler = async (e) => {
        e.preventDefault();
        setErrIn(false);

        if (!usernameIn || !passwordIn) return;

        await axios
            .post(
                "http://localhost:3000/api/user/signin",
                {
                    username: usernameIn,
                    password: passwordIn,
                },
                {
                    withCredentials: true,
                }
            )
            .then(() => navigate("/"))
            .catch((err) => {
                console.log(err);
                setErrIn(true);
            });

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
                {errUp ? (
                    <p>Username already exists or something went wrong</p>
                ) : null}
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
                {errIn ? <p>Incorrect username or password</p> : null}
            </div>
        </>
    );
}