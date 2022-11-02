import React from "react";
import ChooseMentor from "./ChooseMentor";
import MentorNotes from "./MentorNotes";

const Mentee = ({ token, username, mentor_assigned }) => {
  if (mentor_assigned.username.length === 0)
    return <ChooseMentor token={token} username={username} />;
  else {
    return <MentorNotes token={token} mentor_assigned={mentor_assigned} />;
  }
};

export default Mentee;
