import React, { useEffect, useRef, useState } from 'react'
import { useNavigate} from 'react-router-dom';
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";

function VideoPlayer({media}) {

    const videoTag = useRef()                                       //to set for the div same as before
    const [mute, setMute] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)
    const handleClick = () => {
        if(isPlaying) {
            videoTag.current.pause()
            setIsPlaying(false)
        } else {
            videoTag.current.play()
            setIsPlaying(true)
        }
    }

      //handelling sound of multi videos on same page
    
useEffect(() => {
  const video = videoTag.current;
  if (!video) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const vid = videoTag.current;
      if (!vid) return;

      if (entry.isIntersecting) {
        vid.play().catch((e) => console.error("Play error:", e));
        setIsPlaying(true);
      } else {
        vid.pause();
        setIsPlaying(false);
      }
    },
    { threshold: 0.6 }
  );

  observer.observe(video);

  // Cleanup on unmount
  return () => {
    if (video) observer.unobserve(video);
    observer.disconnect();
  };
}, []);

  return (
    <div className='h-[100%] relative cursor-pointer max-w-full
    rounded-2xl overflow-hidden'>
        <video ref={videoTag} src={media} autoPlay loop muted={mute} className='h-[100%] 
        cursor-pointer max-w-full object-cover rounded-2xl overflow-hidden' onClick={handleClick}></video>

    <div className='absolute bottom-[10px] right-[10px]' onClick={()=>setMute(prev=>!prev)}>
        {!mute ? <FiVolume2 className='w-[20px] h-[20px] text-white 
        font-semibold'/> : <FiVolumeX className='w-[20px] h-[20px] text-white 
        font-semibold'/>}
    </div>

    </div>
  )
}

export default VideoPlayer