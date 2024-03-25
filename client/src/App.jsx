import { Home } from "./pages/home";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { PostPage } from "./pages/PostPage";
import { SignUpIn } from "./pages/SignUpIn";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css";
import { NavbarComponent } from "./components/NavbarComponent";
import { Search } from "./pages/Search";
import SessionContext from "./contexts/SessionContext";
import { Suspense } from "react";

function App() {
    return (
        <RecoilRoot>
            <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                    <SessionContext>
                        <BrowserRouter>
                            <NavbarComponent />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/post/:id"
                                    element={<PostPage />}
                                />
                                <Route
                                    path="/signupin"
                                    element={<SignUpIn />}
                                />
                                <Route
                                    path="/search/:text"
                                    element={<Search />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </SessionContext>
                </Suspense>
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
