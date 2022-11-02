import React, { useState, useEffect } from "react";

import "./MenteeApplication.css";
import api from "../../../service/api";

const options = ["one", "two", "three", "four"];

const MenteeApplication = ({ token, pending_messages }) => {
  const [menteeData, setMenteeData] = useState([]);

  const [countDeletion, setCountDeletion] = useState(0);

  useEffect(() => {
    api
      .get("/users/showpending/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        setMenteeData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [token]);

  const verdictMentee = (username, verdict, ind) => {
    if (verdict === "reject") {
      setCountDeletion(countDeletion + 1);
      api
        .post(
          `/users/${verdict}mentee/`,
          { mentee_username: username },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err.response));
    } else {
      api
        .post(
          `/users/${verdict}mentee/`,
          { mentee_username: username },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err.response));
    }
    document.getElementById(`vanish${ind}`).style.display = "none";
  };

  const generateCards = () => {
    const elements = menteeData.map((mentee, ind) => {
      let i = ind % 4;

      const messageArr = pending_messages.filter(
        (message) => message.mentee === mentee.id
      );
      let message = "";
      if (messageArr.length !== 0) message = messageArr[0].message;

      return (
        <div
          className={`feature feature-${options[i]}`}
          key={ind}
          id={`vanish${ind}`}
        >
          <h2 className="feature__title">{mentee.username.toUpperCase()}</h2>
          <div className="feature__desc">
            <ul className="list">
              <li>Branch : {mentee.branch}</li>
              <li>Languages : {mentee.languages}</li>
              {mentee.doesCP && <li>Competitive Programmer</li>}
              {mentee.doesCP && <li>CodeForces Rating : {mentee.CFRank}</li>}
              {mentee.doesCP && <li>CodeChef Rating : {mentee.CCRank}</li>}
              {mentee.doesWeb && <li>Web Developer</li>}
              {mentee.doesApp && <li>App Developer</li>}
              {mentee.doesML && <li>Machine Leaning</li>}
              {message.length !== 0 && <li>Message : {message}</li>}
              <li>Email : {mentee.email}</li>
              <li>Contact : {mentee.phone_number}</li>
            </ul>
            <div className="btn-container-mentor">
              <button
                className="btn-apply"
                onClick={() => {
                  verdictMentee(mentee.username, "accept", ind);
                }}
              >
                Accept
              </button>
              <button
                className="btn-apply"
                onClick={() => {
                  verdictMentee(mentee.username, "reject", ind);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      );
    });
    return elements;
  };

  return (
    <section className="cardContainer">
      <div className="features">
        {menteeData.length !== 0 && generateCards()}
        {menteeData.length === 0 && (
          <div className="no-application">
            <span className="no-text">No Mentee Applications</span>
          </div>
        )}
        {menteeData.length === countDeletion && menteeData.length !== 0 && (
          <div className="no-application">
            <span className="no-text">No Mentee Applications to review</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenteeApplication;
