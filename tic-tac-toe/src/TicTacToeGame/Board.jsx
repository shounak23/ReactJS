import React, { useState } from "react";
import Square from "./Square";

const Board = () => {

    const [state, setState] = useState(Array(9).fill(null));
    const [isXturn, setXturn] = useState(true);
    const [counter, setCounter] = useState(0);

    const checkWinner = () => {
        const winnerLogic = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for(let logic of winnerLogic){

            const [a, b, c] = logic;
            if(state[a] != null && state[a] === state[b] && state[b] === state[c]){

                console.log("Winner");
                return state[a];
            }
                
        }
        return false;
    }

    const checkDraw = () => {

        if(counter === 9)
            return true;
        else
            return false;
    }

    const isWinner = checkWinner()
    const isDraw = checkDraw();

    const handleClick = (index) =>{
        const copyState = [...state];
        if(copyState[index] === null){
            
            if(isXturn){
                copyState[index] = "X";
            }
            else{
                copyState[index] = "0";
            }
        }
        setState(copyState);
        setXturn(!isXturn);
        setCounter(counter+1); // to check match is draw aftr 9 input
    }

    const resetGame = () => {

        setState(Array(9).fill(null));
        setXturn(true);
        setCounter(0);
    }

  return(

    <div className="board-container">
        {(isWinner || isDraw)? (

                <>
                    {isWinner ? <h1>{isWinner} won the game!!!</h1> : <p></p>}
                    {isDraw ? <h1>Draw</h1> : <p></p>}
                    <button onClick={() => resetGame()}>Play Again</button>
                </>
            ) : (

                <>
                    <div className="board-row">
                        <Square onClick={() => handleClick(0)} value={state[0]} />
                        <Square onClick={() => handleClick(1)} value={state[1]} />
                        <Square onClick={() => handleClick(2)} value={state[2]} />
                    </div>
                    <div className="board-row">
                        <Square onClick={() => handleClick(3)} value={state[3]} />
                        <Square onClick={() => handleClick(4)} value={state[4]} />
                        <Square onClick={() => handleClick(5)} value={state[5]} />
                    </div>
                    <div className="board-row">
                        <Square onClick={() => handleClick(6)} value={state[6]} />
                        <Square onClick={() => handleClick(7)} value={state[7]} />
                        <Square onClick={() => handleClick(8)} value={state[8]} />
                    </div>
                </>
            )
        }
    </div>
  );
};

export default Board;
