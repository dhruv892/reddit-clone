import { Home } from "./pages/home";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { PostPage } from "./pages/PostPage";
import { SignUpIn } from "./pages/SignUpIn";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <RecoilRoot>
            <ErrorBoundary>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/post/:id" element={<PostPage />} />
                            <Route path="/signupin" element={<SignUpIn />} />
                        </Routes>
                    </BrowserRouter>
                </React.Suspense>
            </ErrorBoundary>

            <ToastContainer />
        </RecoilRoot>
    );
}

export default App;
