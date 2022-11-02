import React, { useState, useEffect } from "react";
import api from "../../../service/api";
import "./MenteeNotes.css";

const MenteeNotes = ({ token, mentee }) => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const generateCards = () => {
    const elements = notes.map((note, ind) => {
      return (
        <div className="feature-notes" key={ind}>
          <div className="feature__desc-notes">
            <p>{note.notes}</p>
          </div>
        </div>
      );
    });
    return elements;
  };

  useEffect(() => {
    api
      .get("/users/generatenotes/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const reqNotes = res.data.filter(
          (note) => note.mentee[0].username === mentee
        );
        setNotes(reqNotes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [mentee, token]);

  const handleSend = () => {
    api
      .post(
        "/users/generatenotes/",
        {
          mentee_usernames: [mentee],
          note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setNote("");
        setNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="notes-container">
      <div className="features">{notes.length !== 0 && generateCards()}</div>
      <div className="bottom-text">
        <textarea
          type="text"
          className="message-area"
          placeholder="Type your message here ..."
          rows="5"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="btn-message-send" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MenteeNotes;
