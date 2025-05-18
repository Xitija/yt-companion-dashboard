import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

//   import { initialDataState, dataReducer } from "../reducers/DataReducer";

export const Data = createContext();

export const DataProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [videoData, setVideoData] = useState({});

  // const [dataState, dataDispatcher] = useReducer(dataReducer, initialDataState);

  const setData = async () => {
    try {
      const response = await fetch(
        "/api/searches/f68c6a72c6fa6187/68297f9227c2b0aeb2794e04.json"
      );
      const data = await response.json();
      setVideoData({ ...data, comments: [], notes: [] });
    } catch (e) {
      console.error(e);
    }
  };

  const postComment = (text) => {
    if (!text.trim()) return;
    setVideoData((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        {
          id: Math.random().toString(36).slice(2, 9),
          text,
          replies: [],
        },
      ],
    }));
  };

  const removeComment = (commentId) => {
    setVideoData((prev) => ({
      ...prev,
      comments: prev.comments.filter((comment) => comment.id !== commentId),
    }));
  };

  const postReply = (commentId, replyText) => {
    if (!replyText.trim()) return;
    setVideoData((prev) => {
      const updatedComments = prev.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              { id: Math.random().toString(36).slice(2, 9), text: replyText },
            ],
          };
        }
        return comment;
      });
      return { ...prev, comments: updatedComments };
    });
  };

  const removeReply = (commentId, replyId) => {
    setVideoData((prev) => {
      const updatedComments = prev.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          };
        }
        return comment;
      });
      return { ...prev, comments: updatedComments };
    });
  };

  const setTitleAndDescription = (title, description) => {
    if (!title.trim() || !description.trim()) return;
    setVideoData((prev) => ({
      ...prev,
      title,
      description: {
        ...prev.description,
        content: description,
      },
    }));
  };

  const value = {
    setLoader,
    setData,
    setVideoData,
    postComment,
    postReply,
    removeComment,
    removeReply,
    setTitleAndDescription,
    videoData,
  };

  return <Data.Provider value={value}>{children}</Data.Provider>;
};

export const useData = () => useContext(Data);
