import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { addCount, removeCount, resetCount } from "./Features/counterSlice";
// import { useState } from 'react';

function App() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();
  // const [count, setCount] = useState(0);
  return (
    <div className="App">
      <h1>{count}</h1>
      <button onClick={() => dispatch(addCount())}>Add</button>
      <button onClick={() => dispatch(removeCount())}>Subtract</button>
      <button onClick={() => dispatch(resetCount())}>Reset</button>
    </div>
  );
}

export default App;
