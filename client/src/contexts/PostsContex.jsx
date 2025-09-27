import { createContext, useState } from "react";
import PropTypes from "prop-types";
// import axios from "axios";

export const PostContext = createContext();

export default function PostsContext({ children }) {
  const [posts, setPosts] = useState([]);

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
}

PostsContext.propTypes = {
  children: PropTypes.node.isRequired,
};
