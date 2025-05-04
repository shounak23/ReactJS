import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Outlet,
} from "react-router-dom";
import DropdownData from "./DropdownData";

const Header = () => {
  return (
    <div>
      <nav>
        
            <NavLink
              to="/"
              style={{
                margin: "0 10px",
                color: "#aaa",
                textDecoration: "none",
              }}
            >
              Home
            </NavLink>
          
            <NavLink
              to="/contact"
              style={{
                margin: "0 10px",
                color: "#aaa",
                textDecoration: "none",
              }}
            >
              Contact
            </NavLink>

      </nav>
      <DropdownData></DropdownData>
    </div>
  );
};

export default Header;
