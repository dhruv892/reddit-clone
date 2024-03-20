import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function SessionContext({ children }) {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const fetchSessionData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/user/session",
					{
						withCredentials: true,
					}
				);
				console.log("FETCHING SESSION");
				if (response.status === 200) {
					setIsLoggedIn(true);
					const { userId, username } = response.data;
					setUser({ userId, username });
					console.log("LOGGED IN");
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
