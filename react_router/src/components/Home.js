import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPerson, findPerson } from "../Features/AccountSlice";

const Home = () => {
  debugger;
  const [id, setId] = useState();
  const [age, setAge] = useState();
  const [name, setName] = useState();
  const [profession, setProfession] = useState();

  const dispatch = useDispatch();

  // const list = [
  //   { id: 1, name: "John Doe", age: 25, profession: "Engineer" },
  //   { id: 2, name: "Jane Doe", age: 30, profession: "Doctor" },
  //   { id: 3, name: "Sam Smith", age: 35, profession: "Teacher" },
  // ];

  // for (let i = 0; i < list.length; i++) {
  //   dispatch(addPerson(list[i]));
  // }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPerson = {
      id: parseInt(id),
      name,
      age: parseInt(age),
      profession,
    };
    setAge("");
    setId("");
    setName("");
    setProfession("");
    dispatch(addPerson(newPerson));
  };

  return (
    <>
      <div className="container mt-5">
        <h1>Welcome to My Website</h1>
        <p>Select a name from the dropdown to view details.</p>
      </div>
      <div className="container mt-4">
        <h2>Add New Person</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label>ID:</label>
            <input
              type="number"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Age:</label>
            <input
              type="number"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Profession:</label>
            <input
              type="text"
              className="form-control"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Person
          </button>
        </form>
      </div>
    </>
  );
};

export default Home;
