import { Home } from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { PostPage } from "./pages/PostPage";
import { SignUpIn } from "./pages/SignUpIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavbarComponent } from "./components/NavbarComponent";

function App() {
	return (
		<RecoilRoot>
			<BrowserRouter>
				<NavbarComponent />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/post/:id" element={<PostPage />} />
					<Route path="/signupin" element={<SignUpIn />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer />
		</RecoilRoot>
	);
}

export default App;
