import { useState } from "react";
import { useData } from "../context/VideoContext";

export const VideoDetails = ({ video }) => {
  const [text, setText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [videoTitle, setVideoTitle] = useState(video.title);
  const [videoDescription, setVideoDescription] = useState(video.description);
  const {
    postComment,
    postReply,
    removeComment,
    removeReply,
    setTitleAndDescription,
  } = useData();

  return (
    video?.title && (
      <div className="video-details-container">
        <div className="video-wrapper">
          <iframe
            className="video-player"
            src={`https://www.youtube.com/embed/${video.search_parameters.v}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-info">
          <h2 className="video-title">{video.title}</h2>
          <div className="video-description">
            <p>{video.description.content}</p>
          </div>
          <button
            className="edit-button"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
          <div className={`edit-video ${editMode ? "visible" : "hidden"}`}>
            <h3>Edit Video - Title and Description cannot be blank</h3>
            <div className="edit-field">
              <label htmlFor="video-title">Title:</label>
              <input
                id="video-title"
                className="edit-input"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
              />
            </div>
            <div className="edit-field">
              <label htmlFor="video-description">Description:</label>
              <textarea
                id="video-description"
                className="edit-textarea"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Edit video description..."
              />
            </div>
            <button
              className="save-button"
              onClick={() => {
                setTitleAndDescription(videoTitle, videoDescription);
                setEditMode(false);
              }}
            >
              Save
            </button>
          </div>
          <div className="video-stats">
            <span>Published on: {video.published_date}</span>
            <span>{video.views}</span>
            <span>{video.likes} likes</span>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments</h3>
          <div className="comment-form">
            <textarea
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="post-button"
              onClick={() => {
                postComment(text);
                setText("");
              }}
            >
              Post Comment
            </button>
          </div>

          <ul className="comments-list">
            {video.comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-header">
                  <p className="comment-text">{comment.text}</p>
                  <button
                    className="delete-button"
                    onClick={() => removeComment(comment.id)}
                    aria-label="Delete comment"
                  >
                    x
                  </button>
                </div>
                <ReplyForm commentId={comment.id} onReply={postReply} />

                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <div className="reply-content">
                      <p>{reply.text}</p>
                      <button
                        className="delete-button delete-reply"
                        onClick={() => removeReply(comment.id, reply.id)}
                        aria-label="Delete reply"
                      >
                        x
                      </button>
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

const ReplyForm = ({ commentId, onReply }) => {
  const [reply, setReply] = useState("");

  return (
    <div className="reply-form">
      <input
        placeholder="Reply to this comment..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button
        className="reply-button"
        onClick={() => {
          onReply(commentId, reply);
          setReply("");
        }}
      >
        Reply
      </button>
    </div>
  );
};
