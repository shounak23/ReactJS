import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import {
  increment,
  decrement,
  incrementByVal,
} from "./features/counter/counterSlice.js";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </Router>
    </>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial",
  },
  buttonGroup: {
    margin: "10px",
  },
  inputGroup: {
    marginTop: "20px",
  },
};

export default App;
