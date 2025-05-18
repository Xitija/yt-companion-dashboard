import { useState } from "react";
import { useData } from "../context/VideoContext";

export const VideoNotes = () => {
  const [note, setNote] = useState("");
  const { getFilteredNotes, addNote } = useData();
  const [search, setSearch] = useState("");
  return (
    <div className="comments-section">
      <h2 className="notes-heading">Video Notes</h2>
      <div className="comment-form">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your notes here..."
        />
        <button onClick={() => addNote(note)} className="save-button">
          Save Notes
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="comments-list">
        {getFilteredNotes(search)?.map((note) => (
          <li key={note.id} className="comment-item">
            <div className="comment-header">
              <p className="comment-text">{note.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
