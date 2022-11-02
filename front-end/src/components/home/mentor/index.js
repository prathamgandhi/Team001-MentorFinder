import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeData } from "../../../features/userSlice";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import MenteeApplication from "./MenteeApplication";
import MenteeNotes from "./MenteeNotes";
import "./mentor.css";

const Mentor = ({ token, pending_messages, mentee_assigned }) => {
  const [returnHome, setReturnHome] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [navVal, setNavVal] = useState(true);
  const [currMentee, setCurrMentee] = useState("");
  const accRef = useRef(null);
  const dispatch = useDispatch();

  const handleClick = () => {
    accRef.current.classList.toggle("active");
    var panel = accRef.current.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  };
  const handleMentee = (ind) => {
    setCurrMentee(mentee_assigned[ind].username);
    setNavVal(false);
  };

  if (returnHome) {
    dispatch(storeData(null));
    return <Navigate to="/" />;
  }

  return (
    <div className="mentor-container">
      <div id="offCanvas" className="hamburger" onClick={() => setToggle(true)}>
        <GiHamburgerMenu className="icon-ham" />
      </div>
      <div className={`nav-offcanvas ${toggle && "open"}`}>
        <button
          type="button"
          className="close"
          id="offCanvasClose"
          aria-label="Close"
          onClick={() => setToggle(false)}
        >
          <ImCross className="icon-close" />
        </button>
        <div className="nav-offcanvas-menu">
          <ul>
            <li>
              <button onClick={() => setNavVal(true)}>
                Mentee Aplications
              </button>
            </li>
            <li>
              <button className="accordion" ref={accRef} onClick={handleClick}>
                Send Notes
              </button>
              <div className="panel">
                <ul>
                  {mentee_assigned.map((mentee, ind) => {
                    return (
                      <li key={ind}>
                        <button onClick={() => handleMentee(ind)}>
                          {mentee.username}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`offcanvas-overlay ${toggle && "on"}`}
        onClick={() => setToggle(false)}
      ></div>

      <div className="content-wrapper">
        <header className="section__title">
          <h1>{`${
            navVal ? "Mentee Aplications" : "Send Notes to " + currMentee
          }`}</h1>
          <button className="btn-logout" onClick={() => setReturnHome(true)}>
            Logout
          </button>
        </header>
        {navVal && (
          <MenteeApplication
            token={token}
            pending_messages={pending_messages}
          />
        )}
        {!navVal && <MenteeNotes token={token} mentee={currMentee} />}
      </div>
    </div>
  );
};

export default Mentor;
