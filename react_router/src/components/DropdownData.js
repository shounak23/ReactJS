import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPerson, findPerson } from "../Features/AccountSlice";

const DropdownData = () => {
  const [id, setID] = useState();

  const allPersons = useSelector((state) => state.account.details);

  // const list = [
  //   { id: 12, name: "John Doe", age: 25, profession: "Engineer" },
  //   { id: 2, name: "Jane Doe", age: 30, profession: "Doctor" },
  //   { id: 3, name: "Sam Smith", age: 35, profession: "Teacher" },
  // ];

  const dispatch = useDispatch();

  const onButtonClick = (personId) => {
    debugger;
    setID(personId);
    dispatch(findPerson(personId));
    console.log("e.target.id", personId);
  };
  return (
    <div>
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Dropdown button
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {allPersons.map((person) => (
            <button
              class="dropdown-item"
              onClick={() => onButtonClick(person.id)}
              key={person.id}
            >
              {person.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownData;
