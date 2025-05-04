import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Contact from "./Contact";

const LogIn = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path="/contact" element={<Contact/>} />
          </Route>
          
        </Routes>
      </Router>
    </div>
  );
};

export default LogIn;
