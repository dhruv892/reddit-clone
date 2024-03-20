import { useNavigate } from "react-router-dom";
export function NavbarComponent() {
    const navigate = useNavigate();
    const searchHandler = (text) => {
        if (text === "") return;
        navigate(`/search/${text}`);
    };

    return (
        <nav className="fixed top-0 left-0 right-0  bg-zinc-800 p-1">
            {/* <div className="mx-2"></div> */}
            <div className="flex items-center flex-wrap mx-2 ">
                <div className="flex justify-between items-center  text-white w-3/4">
                    <div className="flex items-center ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Reddit"
                            role="img"
                            viewBox="0 0 512 512"
                            width="44"
                            height="44"
                        >
                            <rect
                                width="512"
                                height="512"
                                rx="15%"
                                fill="#f40"
                            />

                            <g fill="#ffffff">
                                <ellipse cx="256" cy="307" rx="166" ry="117" />

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
                    <div className="flex-1 mx-3 items-center">
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
                                // onChange={(e) => searchHandler(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        searchHandler(e.target.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-1/4">
                    <div>
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
                        <button className="bg-orange-600 text-white rounded-full hover:bg-orange-800">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
