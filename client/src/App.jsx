import { Home } from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostPage } from "./pages/PostPage";
import { SignUp } from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css";
import { NavbarComponent } from "./components/NavbarComponent";
import { Search } from "./pages/Search";
import SessionContext from "./contexts/SessionContext";
import PostsContext from "./contexts/PostsContex";
import { Suspense } from "react";
import { LoaderComponent } from "./components/LoaderComponent";
import { SignIn } from "./pages/SignIn";

function App() {
    return (
        <>
            <ErrorBoundary>
                <Suspense fallback={<LoaderComponent />}>
                    <SessionContext>
                        <PostsContext>
                            <BrowserRouter>
                                <NavbarComponent />
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/post/:id"
                                        element={<PostPage />}
                                    />
                                    <Route
                                        path="/signup"
                                        element={<SignUp />}
                                    />
                                    <Route
                                        path="/signin"
                                        element={<SignIn />}
                                    />
                                    <Route
                                        path="/search/:text"
                                        element={<Search />}
                                    />
                                </Routes>
                            </BrowserRouter>
                        </PostsContext>
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
        </>
    );
}

export default App;
