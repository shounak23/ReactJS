import Video from './components/Video'
import './App.css'
import videos from './data/data'
import PlayButton from './components/PlayButton'

function App(){

  
  return(
    <>
      Videos
      <div className='App'>
          {
            videos.map(video=><Video
              key={video.id}
              id={video.id}
              title={video.channelName}
              uplode={video.uplode}
              views={video.views}
              channelName={video.channelName}
              verified={video.verified}
              >

                <PlayButton msg="play-msg" onPlay={()=>console.log('Playy')} onPause={()=>console.log('Pause')}>Play</PlayButton>
              
              </Video>
            )
          }
          <div style={{clear:'both'}}>
            {/* <PlayButton msg="play-msg" onPlay={()=>console.log('Playy')} onPause={()=>console.log('Pause')}>Play</PlayButton> */}
            {/* <PlayButton msg="pause-msg" myOnClick={()=>alert('Playy')} onPause={()=>console.log('Pause')}>Pause</PlayButton> */}
          </div>
      </div>
    </>
  );
}

export default App;