import { Home } from "./pages/home";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { PostPage } from "./pages/PostPage";
import { SignUpIn } from "./pages/SignUpIn";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css";
import { NavbarComponent } from "./components/NavbarComponent";
import axios from "axios";

export const UserContext = React.createContext();

function App() {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [update, setUpdate] = useState(0);

	const updateContext = () => {
		setUpdate((prev) => prev + 1);
	};

	useEffect(() => {
		const fetchSessionData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/user/session",
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
	}, [update]);

	return (
		<RecoilRoot>
			<ErrorBoundary>
				<React.Suspense fallback={<div>Loading...</div>}>
					<BrowserRouter>
						<UserContext.Provider value={{ user, isLoggedIn, updateContext }}>
							<NavbarComponent />
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/post/:id" element={<PostPage />} />
								<Route path="/signupin" element={<SignUpIn />} />
							</Routes>
						</UserContext.Provider>
					</BrowserRouter>
				</React.Suspense>
			</ErrorBoundary>
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition:Bounce
			/>
		</RecoilRoot>
	);
}

export default App;
