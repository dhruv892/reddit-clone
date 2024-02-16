import "./App.css";

import { Home } from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { PostPage } from "./pages/PostPage";

// id,
// title,
// description,
// author,
// time,
// comments;
// votes;

function App() {
	return (
		<RecoilRoot>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/post/:id" element={<PostPage />} />
				</Routes>
			</BrowserRouter>
		</RecoilRoot>
	);
}

export default App;
