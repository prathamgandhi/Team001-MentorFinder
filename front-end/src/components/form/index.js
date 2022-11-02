import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import man from "../../images/man.png";
import Select from "react-select";
import { AiOutlineArrowLeft } from "react-icons/ai";
import api from "../../service/api";
import { useSelector } from "react-redux";
import "./form.css";

const options = [
  { value: "C++", label: "C++" },
  { value: "JAVA", label: "JAVA" },
  { value: "PYTHON", label: "PYTHON" },
  { value: "JAVASCRIPT", label: "JAVASCRIPT" },
  { value: "KOTLIN", label: "KOTLIN" },
  { value: "DART", label: "DART" },
  { value: "R", label: "R" },
];

const Form = () => {
  const [fullName, setFullName] = useState("");
  const [languages, setLanguages] = useState([]);
  const [isCp, setIsCp] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const [isAD, setIsAD] = useState(false);
  const [isWD, setIsWD] = useState(false);
  const [isML, setIsML] = useState(false);
  const [cFRating, setCFRating] = useState(0);
  const [cCRating, setCCRating] = useState(0);
  const [goBack, setGoBack] = useState(false);
  const [goHome, setGoHome] = useState(false);

  const { userData } = useSelector((store) => store.userData);
  const { access, is_mentor, username } = userData;

  const handleLanguageChange = (selectedOptions) => {
    setLanguages(selectedOptions);
  };
  const submitForm = (e) => {
    e.preventDefault();
    const lanArr = languages.map((language) => language.value);
    lanArr.sort();
    let lanString = "";
    lanArr.forEach((lan) => (lanString += " " + lan));
    const payload = {
      CCRank: cCRating,
      CFRank: cFRating,
      doesCP: isCp,
      doesDev: isDev,
      doesApp: isAD,
      doesWeb: isWD,
      doesML: isML,
      languages: lanString,
      username,
    };
    api
      .patch("/users/fillform/", payload, {
        headers: { Authorization: `Bearer ${access}` },
      })
      .then((res) => {
        setGoHome(true);
        console.log(res);
      })
      .catch((err) => console.log(err.response));
  };

  if (goBack) {
    return <Navigate to="/" />;
  }
  if (goHome) {
    return <Navigate to="/home" />;
  }
  return (
    <div className="modal-outer-conatiner">
      <div className="modal">
        <div className="modal__container">
          <div className="modal__featured">
            <button
              type="button"
              className="button--transparent button--close"
              onClick={() => setGoBack(true)}
            >
              <AiOutlineArrowLeft />
            </button>
            <div className="modal__circle"></div>
            <img src={man} className="modal__product" alt="something" />
          </div>
          <div className="modal__content">
            <h2 className="heading">Please, fill the form to continue</h2>
            <form>
              <ul className="form-list">
                <li className="form-list__row">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name=""
                    required=""
                    className="inputF"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </li>
                <li>
                  <Select
                    defaultValue={""}
                    isMulti
                    value={languages}
                    onChange={handleLanguageChange}
                    name="languages"
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="Languages"
                    placeholder="Languages..."
                  />
                </li>
                <li className="form-list__row form-list__row--inline">
                  <div className="check">
                    <input
                      type="checkbox"
                      id="check1"
                      name="checkbox"
                      checked={isDev}
                      onChange={(e) => setIsDev(e.target.checked)}
                    />
                    <label htmlFor="check1" className="label">
                      {" "}
                      {is_mentor ? "Know" : "Interested in"} Developement
                    </label>
                  </div>
                  <div className="check">
                    <input
                      type="checkbox"
                      id="check2"
                      name="checkbox"
                      checked={isCp}
                      onChange={(e) => setIsCp(e.target.checked)}
                    />
                    <label htmlFor="check2" className="label">
                      {" "}
                      {is_mentor ? "Know" : "Interested in"} Competitive
                      Programming
                    </label>
                  </div>
                </li>
                {isDev && (
                  <li className="form-list__row form-list__row--inline">
                    <div className="check">
                      <input
                        type="checkbox"
                        id="check3"
                        name="checkbox"
                        checked={isAD}
                        onChange={(e) => setIsAD(e.target.checked)}
                      />
                      <label htmlFor="check3" className="label">
                        {" "}
                        {is_mentor ? "Know" : "Interested in"} App Dev
                      </label>
                    </div>
                    <div className="check">
                      <input
                        type="checkbox"
                        id="check4"
                        name="checkbox"
                        checked={isWD}
                        onChange={(e) => setIsWD(e.target.checked)}
                      />
                      <label htmlFor="check4" className="label">
                        {" "}
                        {is_mentor ? "Know" : "Interested in"} Web Dev
                      </label>
                    </div>
                    <div className="check">
                      <input
                        type="checkbox"
                        id="check5"
                        name="checkbox"
                        checked={isML}
                        onChange={(e) => setIsML(e.target.checked)}
                      />
                      <label htmlFor="check5" className="label">
                        {" "}
                        {is_mentor ? "Know" : "Interested in"} ML
                      </label>
                    </div>
                  </li>
                )}
                {isCp && (
                  <li className="form-list__row form-list__row--inline">
                    <div>
                      <label>Codeforces Rating</label>
                      <input
                        className="inputF"
                        type="number"
                        name="CFRating"
                        placeholder="1200"
                        value={cFRating}
                        onChange={(e) => setCFRating(e.target.value)}
                        required=""
                      />
                    </div>
                    <div>
                      <label>Codechef Rating</label>
                      <input
                        className="inputF"
                        type="number"
                        name="CCRating"
                        placeholder="1200"
                        value={cCRating}
                        onChange={(e) => setCCRating(e.target.value)}
                        required=""
                      />
                    </div>
                  </li>
                )}
                <li style={{ textAlign: "center" }}>
                  <button onClick={submitForm} className="btn">
                    Submit
                  </button>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
