import React from "react";
import { useSelector } from "react-redux";

const Contact = () => {
  debugger;
  const person = useSelector((state) => state.account.foundPerson);

  return person ? (
    <div className="container mt-5">
      <h2></h2>
      <p>
        <strong>Name:</strong> {person.name}
      </p>
      <p>
        <strong>Age:</strong> {person.age}
      </p>
      <p>
        <strong>Profession:</strong> {person.profession}
      </p>
    </div>
  ) : (
    <div className="container mt-5">No Person is selected</div>
  );
};

export default Contact;
