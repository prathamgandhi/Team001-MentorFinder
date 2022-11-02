import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeData } from "../../../features/userSlice";
import api from "../../../service/api";

const MentorNotes = ({ token, mentor_assigned }) => {
  const [returnHome, setReturnHome] = useState(false);
  const [notes, setNotes] = useState([]);
  const dispatch = useDispatch();

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
        setNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);
  if (returnHome) {
    dispatch(storeData(null));
    return <Navigate to="/" />;
  }
  return (
    <div className="content-wrapper">
      <header className="section__title">
        <h1>Notes From {mentor_assigned.username}</h1>
        <button className="btn-logout" onClick={() => setReturnHome(true)}>
          Logout
        </button>
      </header>
      <div className="features">
        {notes.length !== 0 && generateCards()}
        {notes.length === 0 && (
          <div className="no-application">
            <span className="no-text">No Notes</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorNotes;
