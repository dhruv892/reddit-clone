import { createContext, useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const UserContext = createContext();

export default function SessionContext({ children }) {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const fetchSessionData = async () => {
			try {
				const response = await axios.get(
					"https://reddit-clone-dd-server-84d948f492df.herokuapp.com/api/user/session",
					{
						withCredentials: true,
					}
				);
				if (response.status === 200) {
					setIsLoggedIn(true);
					const { userId, username } = response.data;
					setUser({ userId, username });
				}
			} catch (error) {
				console.log("User is not authenticated");
				setIsLoggedIn(false);
				setUser(null);
			}
		};

		fetchSessionData();
	}, [isLoggedIn]);

	return (
		<UserContext.Provider value={{ user, isLoggedIn, setIsLoggedIn }}>
			{children}
		</UserContext.Provider>
	);
}

SessionContext.propTypes = {
	children: PropTypes.node.isRequired,
};
