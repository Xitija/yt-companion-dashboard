import { createContext, useContext, useState } from "react";

export const Data = createContext();

export const DataProvider = ({ children }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const adminSecret = import.meta.env.VITE_HASURA_ADMIN_SECRET;
  const [videoData, setVideoData] = useState({});

  const setData = async () => {
    try {
      const response = await fetch(
        "/api/searches/f68c6a72c6fa6187/68297f9227c2b0aeb2794e04.json"
      );
      const notesResponse = await fetch(baseUrl + "/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": adminSecret,
        },
      });
      const data = await response.json();
      const notesData = await notesResponse.json();
      setVideoData({ ...data, comments: [], notes: notesData.yt_notes });
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

  const addNote = async (note) => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": adminSecret,
          },
          body: JSON.stringify({ note }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      const data = await response.json();

      setVideoData((prev) => ({
        ...prev,
        notes: [...prev.notes, data.insert_yt_notes_one],
      }));
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const getFilteredNotes = (search) => {
    return videoData?.notes?.filter((item) =>
      item.note.toLowerCase().includes(search.toLowerCase())
    );
  };

  const value = {
    setData,
    setVideoData,
    postComment,
    postReply,
    removeComment,
    removeReply,
    setTitleAndDescription,
    addNote,
    getFilteredNotes,
    videoData,
  };

  return <Data.Provider value={value}>{children}</Data.Provider>;
};

export const useData = () => useContext(Data);
