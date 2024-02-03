import "./App.css";

import { Home } from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// id,
// title,
// description,
// author,
// time,
// comments;
// votes;

function App() {
	return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;