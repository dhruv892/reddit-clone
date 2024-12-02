import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/SessionContext";
import { LoaderComponent } from "../components/LoaderComponent";

export function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [usernameUp, setUsernameUp] = useState("");
    const [passwordUp, setPasswordUp] = useState("");
    const [errUp, setErrUp] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [navigate, user]);

    const signUpHandler = async (e) => {
        e.preventDefault();
        setErrUp(false);
        if (!usernameUp || !passwordUp || !firstName || !lastName) return;
        try {
            await axios.post(
                "https://red-srv.darshanv.dev/api/user/signup",
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
            // console.log(firstName, lastName, usernameUp, passwordUp);
            toast.success("Signed up successfully!");
        } catch (err) {
            console.log(err);
            setErrUp(true);
        }
    };

    return (
        <>
            {user ? (
                <div className="mt-16">
                    <LoaderComponent />
                </div>
            ) : (
                <div className="text-gray-200 max-w-xl mx-auto mt-[10%] bg-zinc-900 p-5">
                    <form
                        className="flex flex-col gap-2 "
                        onSubmit={signUpHandler}
                    >
                        <h1 className="text-2xl font-bold mb-3">Sign Up</h1>
                        <label className="font-semibold">First Name</label>
                        <input
                            type="text"
                            className="mb-3"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                        />
                        <label className="font-semibold">Last Name</label>
                        <input
                            type="text"
                            className="mb-3"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                        />
                        <label className="font-semibold">Username</label>
                        <input
                            className="mb-3"
                            type="text"
                            name="usernameUp"
                            value={usernameUp}
                            onChange={(e) => setUsernameUp(e.target.value)}
                            placeholder="Username"
                        />
                        <label className="font-semibold">Password</label>
                        <input
                            className="mb-3"
                            type="password"
                            name="passwordUp"
                            value={passwordUp}
                            onChange={(e) => setPasswordUp(e.target.value)}
                            placeholder="Password"
                        />
                        <input type="submit" value="Sign up" />
                        <div className="mt-5 flex flex-col">
                            <p>Already have an account? Sign In below!</p>
                            <button
                                className="bg-zinc-800 mt-2"
                                onClick={() => {
                                    navigate("/signIn");
                                }}
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                    {errUp ? (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                Username already exists or something went wrong
                            </span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
                        </div>
                    ) : null}
                </div>
            )}
        </>
    );
}
