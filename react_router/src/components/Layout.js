import React from "react";
import Header from "./Header";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    NavLink,
    Outlet,
  } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header />
      <hr></hr>
      <Outlet/>
    </div>
  );
};

export default Layout;
