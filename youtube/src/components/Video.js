import bus from './IMG_5795.JPG';
import './Video.css';

function Video({id,title, views = '1K' , channelName, uplode, verified = false, children}){

    return(
        <div className='container'>
            <div className='img'>
                <img className='pic' src={bus} height={200} width={300} alt="bus"></img>
            </div>
            <div className='title'>{title}</div>
            {/* <div className='channelName'>{channelName} ✅</div> */}
            <div className='channelName'>{channelName} {verified?'✅':null}</div>
            <div className='views'>{views}<span> . </span> {uplode}</div>

            <div>
                {children}
            </div>
        </div>
    )
}

export default Video;