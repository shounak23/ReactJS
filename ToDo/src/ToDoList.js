import React, { useState } from "react";

const TodoList = ({todos, deleteTodo, editTodo, filterTodo, sorting, filtering }) => {

  const [isEdit, setIsEdit] = useState(null);
  const [textField, setTextField] = useState("");
  const [titleField, setTitleField] = useState("");
  const [priority, setPriority] = useState("");
  const [isChecked, setIsChecked] = useState();

  console.log(filterTodo);

  const saveEdit = (item)=>{
    
    if(textField.trim() === ""){
      window.alert("Cannot save blank todo, delete it or enter value!!!")
      
    }
    else{
      item.val = textField;
      item.title = titleField;
      item.date = Date();
      item.isComplete = isChecked;
      item.priority = priority;
      editTodo(item);
      setIsEdit(null);
    }    
  }

  const restoreTextField = ()=>{
    setIsEdit(null);
  }

  const handleEdit = (item)=>{

    setIsEdit(item.id);
    setIsChecked(item.isComplete);
    setTextField(item.val);
    setTitleField(item.title);
    setPriority(item.priority);
  }

  const handleDelete = (id)=>{
    
    deleteTodo(id);
  }

  const priorityToNum = (priority) => {
    if (priority === "low") return -1;
    else if (priority === "medium") return 0;
    else return 1;
  };
  
  const filteredTodos = todos.filter((todo) => {
      if (filtering === "isComplete") {
        return todo.isComplete;
      } else if (filtering === "high") {
        return todo.priority === "high";
      } else if (filtering === "low") {
        return todo.priority === "low";
      } else if (filtering === "medium") {
        return todo.priority === "medium";
      } else if(filtering === "default")
        return true; // If no filter, show all todos
    });
  
    const sortToDo = (sortingCatogory) => {
      if(sortingCatogory === "default"){
        return filteredTodos;
      }
      else if (sortingCatogory === "isComplete") {
        return filteredTodos.sort((a, b) => b.isComplete - a.isComplete);
      } else if (sortingCatogory === "priority") {
        return filteredTodos.sort(
          (a, b) => priorityToNum(b.priority) - priorityToNum(a.priority)
        );
      } else if (sortingCatogory === "date") {
        return filteredTodos.sort((a, b) => b.id - a.id);
      }
    };
  
    const sortedToDo = sortToDo(sorting);
  
    const getBackgroundColor = (priority) => {
      if (priority === "low") return "green";
      else if (priority === "medium") return "yellow";
      else return "red";
    };  

  return (
    <div>
      {sortedToDo.map((item) => (
        <div key={item.id} className="todo-item">
          {item.id === isEdit ? (
            <>
              <div className="d-flex-row">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={()=>setIsChecked(!isChecked)}
                  className="m-2"
                />
                <select
                  onChange={(event) => {
                    setPriority(event.target.value);
                  }}
                  value={priority}
                >
                  {/* <option value="default">Sorting</option> */}
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div>
                  <textarea
                    onChange={(e)=>{setTitleField(e.target.value)}}
                    value={titleField}
                    style={{resize: "none"}}
                  />
                  <textarea
                    onChange={(e)=>{setTextField(e.target.value)}}
                    value={textField}
                    style={{resize: "none"}}
                  />
                </div>
                <button className="btn-save m-1"
                  onClick={()=>saveEdit(item)}
                >
                  Save
                </button>
                {(textField.trim() === "") && (
                    <button className="btn-cancel m-1"
                      onClick={()=>restoreTextField()}
                    >
                      cancel
                    </button>
                  )
                }
              </div>
            </>
          ) : (
            <>
              <div className="todo-header">
              <span>
                <div className="d-flex justify-content-between">
                  {/* <div style={{ backgroundColor: getBackgroundColor(item.priority) }}> */}
                  <div className={`todo-priority ${item.priority}`}>
                    <h3 className="todo-title">{item.title}</h3>
                  </div>
                  <div className="todo-date" style={{margin: "5px"}}><h6 >{item.date}</h6></div>
                  <div className="todo-priority-label"><h6 >{item.priority}</h6></div>                
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <input
                      type="checkbox"
                      checked={item.isComplete}
                      className="m-2"
                    />
                  </div>
                  <div>{item.val}</div>                
                </div>
                
              </span>
              </div>
              <button className="btn-edit" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoList;

