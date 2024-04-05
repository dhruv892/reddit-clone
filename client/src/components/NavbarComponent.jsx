import { useContext } from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../contexts/SessionContext";

import { toast } from "react-toastify";
import axios from "axios";
import { CreatePost } from "./CreatePost";

export function NavbarComponent() {
    const navigate = useNavigate();
    const { user, setIsLoggedIn } = useContext(UserContext);
    const [addClicked, setAddClicked] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);
    // const param = useParams();
    // console.log(param);

    const addClickedHandler = () => {
        if (!user) return toast.error("Please login to create a post.");
        setAddClicked((prev) => !prev);
    };

    const logoutHandler = async () => {
        try {
            await axios.get("http://localhost:3000/api/user/signout", {
                withCredentials: true,
            });

            setIsLoggedIn(false);
            toast.success("Successfully logged out!");
        } catch (error) {
            console.error(error);
            toast.error("Error occurred while logging out.");
        }
    };
    const searchHandler = () => {
        if (searchText === "") return;
        // setSearchText("");
        navigate(`/search/${searchText}`);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            // e.stopPropagation();
            if (
                showDropdown &&
                dropDownRef.current &&
                !dropDownRef.current.contains(e.target)
            ) {
                // console.log("clicked outside", dropDownRef);
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-zinc-800 p-1">
                {/* <div className="mx-2"></div> */}
                <div className="flex items-center flex-wrap mx-2 ">
                    <div className="flex justify-between items-center  text-white w-1/4">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Reddit"
                                role="img"
                                viewBox="0 0 512 512"
                                width="44"
                                height="44"
                                className="hover:scale-100"
                            >
                                <rect
                                    width="512"
                                    height="512"
                                    rx="15%"
                                    fill="#f40"
                                />

                                <g fill="#ffffff">
                                    <ellipse
                                        cx="256"
                                        cy="307"
                                        rx="166"
                                        ry="117"
                                    />

                                    <circle cx="106" cy="256" r="42" />

                                    <circle cx="407" cy="256" r="42" />

                                    <circle cx="375" cy="114" r="32" />
                                </g>

                                <g
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                >
                                    <path
                                        d="m256 196 23-101 73 15"
                                        stroke="#ffffff"
                                        strokeWidth="16"
                                    />

                                    <path
                                        d="m191 359c33 25 97 26 130 0"
                                        stroke="#f40"
                                        strokeWidth="13"
                                    />
                                </g>

                                <g fill="#f40">
                                    <circle cx="191" cy="287" r="31" />

                                    <circle cx="321" cy="287" r="31" />
                                </g>
                            </svg>

                            <span className="font-semibold text-xl tracking-tight ml-2">
                                Reddit
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 mx-3 text-white items-center w-2/4">
                        <div className="flex border border-zinc-500 items-center rounded-full px-2 w-full hover:border-white">
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.5em"
                                    height="1.5em"
                                    viewBox="0 0 24 24"
                                    className="hover:scale-100"
                                >
                                    <g fill="none" fillRule="evenodd">
                                        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                        <path
                                            fill="#b2aeae"
                                            d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
                                        ></path>
                                    </g>
                                </svg>
                            </div>

                            <input
                                type="text"
                                placeholder="Search Reddit"
                                className="focus:outline-none"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        // setSearchText(e.target.value);
                                        searchHandler();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between w-1/4">
                        <div
                            className="cursor-pointer"
                            onClick={addClickedHandler}
                        >
                            <i>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="2.5em"
                                    height="2.5em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="white"
                                        d="M11.5 12.5H6v-1h5.5V6h1v5.5H18v1h-5.5V18h-1z"
                                    ></path>
                                </svg>
                            </i>
                        </div>
                        <div>
                            {!user ? (
                                <button
                                    className="bg-orange-600 text-white rounded-full hover:bg-orange-800"
                                    // onClick={() => {
                                    //     navigate("/signupin");
                                    // }}
                                >
                                    Log In
                                </button>
                            ) : (
                                <i
                                    ref={dropDownRef}
                                    onClick={() => {
                                        // e.stopPropagation();
                                        setShowDropdown((prev) => !prev);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={44}
                                        height={44}
                                        viewBox="0 0 24 24"
                                        className="hover:scale-100"
                                    >
                                        <g
                                            fill="#b2aeae"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        >
                                            <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path>
                                            <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.986 8.986 0 0 1 12.065 14a8.984 8.984 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.963 8.963 0 0 1-5.672-2.012A6.992 6.992 0 0 1 12.065 16a6.991 6.991 0 0 1 5.689 2.92A8.964 8.964 0 0 1 12 21"></path>
                                        </g>
                                    </svg>
                                </i>
                                // <Dropdown />
                            )}
                            {/* <button className="bg-orange-600 text-white rounded-full hover:bg-orange-800">
                            Sign In
                        </button> */}
                        </div>
                    </div>
                </div>

                {addClicked && (
                    <CreatePost addClickedHandler={addClickedHandler} />
                )}
            </nav>
            {showDropdown && (
                <div
                    // ref={dropDownRef}
                    className="fixed top-12 mt-1 right-2 bg-zinc-800 "
                >
                    <ul className="pt-2 text-white">
                        <li className="flex items-center hover:bg-zinc-600">
                            <div className="p-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.2em"
                                    height="1.2em"
                                    viewBox="0 0 24 24"
                                    className="hover:scale-100"
                                >
                                    <g
                                        fill="#b2aeae"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    >
                                        <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path>
                                        <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.986 8.986 0 0 1 12.065 14a8.984 8.984 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.963 8.963 0 0 1-5.672-2.012A6.992 6.992 0 0 1 12.065 16a6.991 6.991 0 0 1 5.689 2.92A8.964 8.964 0 0 1 12 21"></path>
                                    </g>
                                </svg>
                            </div>
                            <div className="pr-2">View Profile</div>
                        </li>
                        <li
                            className="flex items-center hover:bg-zinc-600"
                            onClick={logoutHandler}
                        >
                            <div className="p-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.2em"
                                    height="1.2em"
                                    viewBox="0 0 24 24"
                                    className="hover:scale-100"
                                >
                                    <path
                                        fill="none"
                                        stroke="#b2aeae"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1"
                                    ></path>
                                </svg>
                            </div>
                            <div className="pr-2">Log Out</div>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}
