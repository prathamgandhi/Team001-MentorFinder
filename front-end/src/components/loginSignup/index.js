import React, { useState } from "react";
import api from "../../service/api";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import "./loginSignup.css";
import { storeData } from "../../features/userSlice";

const LoginSignup = () => {
  const dispatch = useDispatch();
  const [toggleS, setToggleS] = useState(false);
  const [toggleF, setToggleF] = useState(false);
  const [check, setCheck] = useState(false);
  const [navigate, setNavigate] = useState(0);
  const loginInitial = {
    email: "",
    password: "",
  };
  const [loginDetails, setLoginDetails] = useState(loginInitial);
  const signupInitial = {
    username: "",
    password: "",
    cPassword: "",
    branch: "",
    contact: "",
    email: "",
  };
  const [signupDetails, setSignupDetails] = useState(signupInitial);

  const loginDetailsChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const signupDetailsChange = (e) => {
    setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value });
  };

  const goToggle = () => {
    setLoginDetails(loginInitial);
    setSignupDetails(signupInitial);
    setTimeout(() => {
      setToggleS(!toggleS);
    }, 300);
    setToggleF(!toggleF);
  };

  const postLogin = () => {
    api
      .post("/users/login/", loginDetails)
      .then((res) => {
        dispatch(storeData(res.data));
        if (res.data.form_filled) {
          setNavigate(1);
        } else {
          setNavigate(2);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) alert(err.response.data.detail);
        console.log(err.response);
      });
  };
  const postSignup = () => {
    if (signupDetails.password !== signupDetails.cPassword) {
      alert("Confirm password is wrong");
      return;
    }
    const url = `/users/${check ? "registermentor" : "registermentee"}/`;
    const payload = {
      username: signupDetails.username,
      password: signupDetails.password,
      branch: signupDetails.branch,
      phone_number: "+91" + signupDetails.contact,
      email: signupDetails.email,
    };
    api
      .post(url, payload)
      .then((res) => {
        goToggle();
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  if (navigate === 1) {
    return <Navigate to="/home" />;
  } else if (navigate === 2) {
    return <Navigate to="/form" />;
  } else {
    return (
      <div className="log_container">
        <div className={`bg ${toggleF && "flip"}`}>
          <span className="bg-item"></span>
          <span className="bg-item"></span>
          <span className="bg-item"></span>
          <span className="bg-item"></span>
        </div>
        <div className={`login_signup_form ${toggleF && "flip"}`}>
          <div className={`login ${toggleS && "hidden"}`}>
            <svg
              className="svg user"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" />
            </svg>
            <h2 className="banner">Log In</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="input"
                type="text"
                id="login_email"
                name="email"
                value={loginDetails.email}
                onChange={loginDetailsChange}
                placeholder="email"
                autoFocus
                required
              />
              <input
                className="input"
                type="password"
                id="login_password"
                name="password"
                value={loginDetails.password}
                onChange={loginDetailsChange}
                placeholder="Password"
                autoFocus
                required
              />
              <div className="btn-container">
                <button className="btn" onClick={postLogin}>
                  Log in
                </button>
              </div>
            </form>
            <h4 className="h4">
              New Here?{" "}
              <span className="register-btn" onClick={goToggle}>
                Register Now!
              </span>
            </h4>
          </div>
          <div className={`signup ${!toggleS && "hidden"}`}>
            <svg
              className="svg user"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" />
            </svg>
            <h2 className="banner">Sign Up</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="input"
                type="text"
                name="username"
                value={signupDetails.username}
                onChange={signupDetailsChange}
                placeholder="Username"
                autoFocus
                required
              />
              <input
                className="input"
                type="text"
                id="signup_email"
                name="email"
                value={signupDetails.email}
                onChange={signupDetailsChange}
                placeholder="email"
                autoFocus
                required
              />

              <select
                name="branch"
                id="branch"
                className="select"
                onChange={signupDetailsChange}
                autoFocus
                value={signupDetails.branch}
              >
                <option value="" disabled>
                  select a branch
                </option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="CHE">CHE</option>
                <option value="MME">MME</option>
                <option value="BIOTECH">BIOTECH</option>
                <option value="BIOMED">BIOMED</option>
              </select>

              <input
                className="input"
                type="number"
                name="contact"
                value={signupDetails.contact}
                onChange={signupDetailsChange}
                placeholder="Contact Number"
                required
                autoFocus
              />
              <input
                className="input"
                type="password"
                id="signup_password"
                name="password"
                value={signupDetails.password}
                onChange={signupDetailsChange}
                placeholder="Password"
                required
                autoFocus
              />
              <input
                className="input"
                type="password"
                id="confirm_password"
                name="cPassword"
                value={signupDetails.cPassword}
                onChange={signupDetailsChange}
                placeholder="Confirm Password"
                required
                autoFocus
              />
              <br />
              <div className="check-container">
                <input
                  type="checkbox"
                  id="check"
                  name="checkbox"
                  checked={check}
                  onChange={(e) => setCheck(e.target.checked)}
                />
                <label htmlFor="check" className="label">
                  {" "}
                  Register as a mentor
                </label>
              </div>
              <div className="btn-container">
                <button className="btn" onClick={postSignup}>
                  Sign up
                </button>
              </div>
            </form>

            <h4 className="h4">
              Old Friend?{" "}
              <span className="login-btn" onClick={goToggle}>
                Login Here!
              </span>
            </h4>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginSignup;
