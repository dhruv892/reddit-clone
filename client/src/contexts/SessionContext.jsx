import { createContext, useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const UserContext = createContext();

export default function SessionContext({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await axios.get(
                    "https://red-srv.darshanv.dev/api/user/session",
                    {
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    setIsLoggedIn(true);
                    const { userId, username } = response.data;
                    setUser({ userId, username });
                    // setIsFetching(false);
                }
            } catch (error) {
                console.log("User is not authenticated");
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        fetchSessionData();
    }, [isLoggedIn]);

    const setIsFetchingHandler = () => {
        setIsFetching((prev) => !prev);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                isLoggedIn,
                setIsLoggedIn,
                setIsFetchingHandler,
                isFetching,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

SessionContext.propTypes = {
    children: PropTypes.node.isRequired,
};
