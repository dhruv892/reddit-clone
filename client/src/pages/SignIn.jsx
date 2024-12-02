import { SignInComponent } from "../components/SignInComponent";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/SessionContext";
import { LoaderComponent } from "../components/LoaderComponent";

export function SignIn() {
    // const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [navigate, user]);
    // useEffect(() => {
    //     if (!user) {
    //         // setIsFetchingHandler();
    //     }
    // }, [setIsFetchingHandler, user]);

    return (
        <>
            {user ? (
                <div className="mt-16">
                    <LoaderComponent />
                </div>
            ) : (
                <div className="text-gray-200 max-w-xl mx-auto mt-[10%] bg-zinc-900 p-5">
                    <SignInComponent />
                </div>
            )}
        </>
    );
}
