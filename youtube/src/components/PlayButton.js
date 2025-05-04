import './PlayButton.css';

function PlayButton({msg, children, onPlay, onPause}){

    let running = false;

    function handelClick(){

        if(!running)
            onPlay();
        else
            onPause();

        running = !running;
        // console.log(msg)
    }
    return(

        // <button onClick={()=>console.log('Play')}>PlayButton</button>
        <button onClick={handelClick}>{children}</button> 
    )
}

export default PlayButton;