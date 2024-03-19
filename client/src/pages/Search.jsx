import { useParams } from "react-router";

export function Search() {
    const params = useParams();
    console.log(params.text);
    return (
        <>
            <h1 className="text-white mt-20">
                In search page with {params.text}
            </h1>
        </>
    );
}
