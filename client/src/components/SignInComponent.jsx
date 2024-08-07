import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/SessionContext";
import { useNavigate } from "react-router-dom";

export function SignInComponent() {
    const [usernameIn, setUsernameIn] = useState("");
    const [passwordIn, setPasswordIn] = useState("");
    const [errIn, setErrIn] = useState(false);
    const { setIsLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const signInHandler = async (e) => {
        e.preventDefault();
        setErrIn(false);

        if (!usernameIn || !passwordIn) return;
        try {
            await axios.post(
                "https://red-srv.darshanv.dev/api/user/signin",
                {
                    username: usernameIn,
                    password: passwordIn,
                },
                {
                    withCredentials: true,
                }
            );
            setIsLoggedIn(true);
            toast.success("Logged in successfully!");
            navigate("/");
            // console.log(usernameIn, passwordIn);
        } catch (err) {
            // console.log(err);
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
                <div className="mt-5 flex flex-col">
                    <p>Dont have an account? Sign up below!</p>
                    <button
                        className="bg-zinc-800 mt-2"
                        onClick={() => {
                            navigate("/signUp");
                        }}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
            {errIn ? (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3"
                    role="alert"
                >
                    <span className="block sm:inline">
                        Incorrect Username or Password
                    </span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
                </div>
            ) : null}
        </div>
    );
}
