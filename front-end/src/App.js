import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Form from "./components/form";
import LoginSignup from "./components/loginSignup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/" element={<LoginSignup />} />
      </Routes>
    </Router>
  );
};

export default App;
