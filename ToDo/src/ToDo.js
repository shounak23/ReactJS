import React, { useEffect, useState } from "react";
import TodoList from "./ToDoList";

const Todo = () => {
  const [addNewToDoVisiable, setAddNewToDoVisiable] = useState(false);
  const [textAreaInput, setTextAreaInput] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [saveToDo, setSaveToDo] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos != null ? JSON.parse(savedTodos) : [];
  });
  const [sorting, setSorting] = useState("date");
  const [filtering, setFiltering] = useState("default");

  // const options = {
  //   weekday: "short",
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  //   hour: "2 - digit",
  //   minute: "2 - digit",
  //   second: "2 - digit",
  //   hour12: false, // Use 24-hour format
  // };

  const addNewList = () => {
    setAddNewToDoVisiable(!addNewToDoVisiable);
  };

  const editToDo = (todo) => {
    const newToDo = saveToDo.map((item) =>
      item.id === todo.id ? { ...item, val: todo.val } : item
    );
    // localStorage.setItem("todos", JSON.stringify(saveToDo));
    setSaveToDo(newToDo);
  };

  const saveTextArea = (e) => {
    // if(textAreaInput.val !== "")
    setTextAreaInput(e.target.value);
  };

  const save = () => {
    if (textAreaInput.trim() === "") return;
    const todoSet = {
      id: Date.now(),
      title: todoTitle,
      val: textAreaInput,
      date: Date(), //new Date().toLocaleString("en-IN", options),
      priority: "high",
      isComplete: false,
    };
    setSaveToDo((prev) => [...prev, todoSet]);
    setTodoTitle("");
    setTextAreaInput("");
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(saveToDo));
  }, [saveToDo]);

  const clearAll = () => {
    setSaveToDo([]);
  };

  const deleteToDo = (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      const updatetdToDo = saveToDo.filter((saveToDo) => saveToDo.id !== id);
      setSaveToDo(updatetdToDo);
    }
  };

  return (
    <div>
      <div className="container">
        <h1>To Do List</h1>
        <div className="button_new">
          <button onClick={addNewList} className="btn btn-primary">Add New</button>
          <select
            onChange={(event) => {
              setFiltering(event.target.value);
            }}
            value={filtering}
            className="form-select"
          >
            <option value="default">Filtering</option>
            <option value="isComplete">Is Complete</option>
            <option value="high">Priority High</option>
            <option value="medium">Priority Medium</option>
            <option value="low">Priority Low</option>
          </select>
          {/* <button>Show All</button> */}
          <select
            onChange={(event) => {
              setSorting(event.target.value);
            }}
            value={sorting}
            className="form-select"
          >
            <option value="default">Sorting</option>
            <option value="date">Date</option>
            <option value="isComplete">Is Complete</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        {addNewToDoVisiable && (
          <div className="display_add_new_note">
            <div>
              <textarea
                placeholder="Title"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                style={{width:"80%", height:"40px", resize: "none",}}
                className="form-control"
              />
              <textarea
                onChange={saveTextArea}
                value={textAreaInput}
                placeholder="Add New"
                className="form-control"
                style={{width:"80%", height:"40px", resize: "none",}}
              />
            </div>
            <div>
              <button
                onClick={save}
                style={{ margin: "5px" }}
                className="btn btn-success"
              >
                Save
              </button>
            </div>
          </div>
        )}
        <div className="all_todo_list">
          {saveToDo.length != 0 && (
            <TodoList
              todos={saveToDo}
              deleteTodo={deleteToDo}
              editTodo={editToDo}
              sorting={sorting}
              filtering={filtering}
            />
          )}
        </div>
        <button
          onClick={clearAll}
          style={{ margin: "5px" }}
          className="clear-btn"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Todo;