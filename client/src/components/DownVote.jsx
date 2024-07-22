import PropTypes from "prop-types";
export function DownVoteLogo({ voted = false }) {
    return (
        <svg
            fill={voted ? "#7193ff" : "#eee"}
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059z" />
        </svg>
    );
}

DownVoteLogo.propTypes = {
    voted: PropTypes.bool,
};
