import React from "react";
import Mentee from "./mentee";
import Mentor from "./mentor";
import { useSelector } from "react-redux";

const Home = () => {
  const { userData } = useSelector((store) => store.userData);
  const {
    is_mentor,
    access,
    username,
    pending_messages,
    mentee_assigned,
    mentor_assigned,
  } = userData;

  return is_mentor ? (
    <Mentor
      token={access}
      pending_messages={pending_messages}
      mentee_assigned={mentee_assigned}
    />
  ) : (
    <Mentee
      token={access}
      username={username}
      mentor_assigned={mentor_assigned}
    />
  );
};

export default Home;
