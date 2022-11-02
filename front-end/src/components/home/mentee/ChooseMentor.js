import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeData } from "../../../features/userSlice";
import "./ChooseMentor.css";
import api from "../../../service/api";

const options = [
  {
    number: "one",
    src: "https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-supervisor.svg",
  },
  {
    number: "two",
    src: "https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-team-builder.svg",
  },
  {
    number: "three",
    src: "https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-karma.svg",
  },
  {
    number: "four",
    src: "https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-calculator.svg",
  },
];

const ChooseMentor = ({ token, username }) => {
  const [mentorData, setMentorData] = useState([]);
  const [returnHome, setReturnHome] = useState(false);
  const [message, setMessage] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("/users/searchmentors?username=" + username, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        setMentorData(res.data);
        var arr = [];
        for (var i = 0; i < res.data.length; i++) {
          arr[i] = "";
        }
        setMessage(arr);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [token, username]);

  const applyMentor = (username, ind) => {
    api
      .post(
        "/users/requestmentor/",
        { mentor_username: username, message: message[ind] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err.response));
  };

  const generateCards = () => {
    const elements = mentorData.map((mentor, ind) => {
      let i = ind % 4;
      const applied = mentor.mentees.some(
        (mentee) => mentee.username === username
      );
      return (
        <div
          className={`feature feature-height feature-${options[i].number}`}
          key={ind}
        >
          <h2 className="feature__title">{mentor.username.toUpperCase()}</h2>
          <div className="feature__desc">
            <ul className="list">
              <li>Branch : {mentor.branch}</li>
              <li>Languages : {mentor.languages}</li>
              {mentor.doesCP && <li>Competitive Programmer</li>}
              {mentor.doesCP && <li>CodeForces Rating : {mentor.CFRank}</li>}
              {mentor.doesCP && <li>CodeChef Rating : {mentor.CCRank}</li>}
              {mentor.doesWeb && <li>Web Developer</li>}
              {mentor.doesApp && <li>App Developer</li>}
              {mentor.doesML && <li>Machine Leaning</li>}
              <li>Email : {mentor.email}</li>
              <li>Contact : {mentor.phone_number}</li>
              <li>
                <input
                  type="text"
                  className="message"
                  placeholder="Send message to mentor"
                  onChange={(e) => {
                    var arr = [];
                    for (let i = 0; i < message.length; i++) {
                      if (i === ind) arr[i] = e.target.value;
                      else arr[i] = message[i];
                    }
                    setMessage(arr);
                  }}
                  value={message[ind]}
                />
              </li>
            </ul>
            <button
              className={applied ? "btn-applied" : "btn-apply"}
              onClick={(e) => {
                e.target.disabled = true;
                e.target.style.animation = "none";
                e.target.innerText = "Applied";
                applyMentor(mentor.username, ind);
              }}
            >
              {applied ? "Applied" : "Apply"}
            </button>
          </div>
          <img className="feature__img" src={options[i].src} alt="" />
        </div>
      );
    });
    return elements;
  };

  if (returnHome) {
    dispatch(storeData(null));
    return <Navigate to="/" />;
  }
  return (
    <section className="cardContainer">
      <header className="section__title">
        <h1>Apply For Mentor</h1>
        <button className="btn-logout" onClick={() => setReturnHome(true)}>
          Logout
        </button>
      </header>

      <div className="features">
        {mentorData.length !== 0 && generateCards()}
      </div>
    </section>
  );
};

export default ChooseMentor;
