import { useContext, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { UserContext } from "../contexts/SessionContext";
import API_BASE_URL from "../api";

export default function AddComment({ id, setCommentsHandler, setDoReply }) {
  const [content, setContent] = useState("");
  const { isLoggedIn } = useContext(UserContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!content) {
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/post/addComment/${id}`,
        {
          content,
          createdAt: String(Date.now()),
        },
        {
          withCredentials: true,
        }
      );
      setCommentsHandler(response.data.comment);
      // console.log(response);
      setContent("");
      setDoReply();
      // doReplyHandler();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoggedIn) {
    return <p className="p-2 m-2 text-lg">User must be logged in to comment</p>;
  }

  return (
    <div className="bg-zinc-900 rounded-lg py-2 mt-2">
      <form className="flex gap-5" onSubmit={submitHandler}>
        <input
          className="bg-zinc-800 placeholder:text-zinc-500 flex-grow p-2 rounded-lg"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comment"
        />
        <button
          className="py-2 px-4 flex-initial rounded-lg bg-zinc-700"
          onClick={submitHandler}
        >
          Add comment
        </button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  id: PropTypes.string.isRequired,
  setCommentsHandler: PropTypes.func,
  setDoReply: PropTypes.func,
};
