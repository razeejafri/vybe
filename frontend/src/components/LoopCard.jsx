import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";
import dp from "../assets/dp.jpeg"
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useSelector } from 'react-redux';
import { MdOutlineInsertComment } from "react-icons/md";
import { setLoopData } from '../redux/loopSlice';
import { serverUrl } from '../App';
import axios from 'axios';
import { useDispatch } from "react-redux"
import { IoMdSend } from "react-icons/io";

function LoopCard({loop}) {

  const videoRef = useRef()
  const commentRef = useRef()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMute, setIsMute] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const [showheart, setShowheart] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [message, setMessage] = useState("")

   const {userData} = useSelector(state => state.user)
   const {loopData} = useSelector(state=>state.loop)
   const {socket} = useSelector(state=>state.socket)
   const dispatch = useDispatch()

   //progress
  const handleTimeUpdate  = () => {
    const video = videoRef.current
    if(video) {
      const percent = (video.currentTime / video.duration)*100
      setProgress(percent)
    }
  }

  const handleLikeOnDoubleClick = () => {
    setShowheart(true)
    setTimeout(() => setShowheart(false), 6000)
    {!loop.likes?.includes(userData._id) ? handleLike() : null}
  }

  const handleClick = () => {
    if(isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, 
            {withCredentials: true})
            const updatedLoop = result.data                                          //chnage in the loopData

            const updatedLoops = loopData.map(p => p._id == loop._id ?              ///replace the p with updated post
                updatedLoop : p
            )
            dispatch(setLoopData(updatedLoops))
        } catch (error) {
            console.log(error)
        }
  }

  const handleComment = async () => {
        if(!message) {
            return
        }
        try {
            const result = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`, {message},
            {withCredentials: true})
            const updatedLoop = result.data                                          //chnage the postData

            const updatedLoops = loopData.map(p => p._id == loop._id ?              ///replace the p with updated post
                updatedLoop : p
            )
            dispatch(setLoopData(updatedLoops))
            setMessage("")
        } catch (error) {
            console.log(error)
        }
    }

    // clicking outside the comment box
    useEffect(() => {
      const handleClickOutside = (event) => {
        if(commentRef.current && !commentRef.current.contains(event.target)) {
          setShowComment(false)
        }
      }

      if(showComment) {
        document.addEventListener("mousedown", handleClickOutside)      //event
      } else {
        document.removeEventListener("mousedown", handleClickOutside)    //event
      }

    }, [showComment])

  //handelling sound of multi videos on same page

  useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const vid = videoRef.current;
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

useEffect(() => {
        socket?.on("likedLoop", (updatedData) => {
            
        const updatedLoops = loopData.map(p => p._id == updatedData.loopId ?              ///replace the p with updated post
            {...p, likes: updatedData.likes} : p
        )

        dispatch(setLoopData(updatedLoops))
        })

        socket?.on("commentedLoop", (updatedData) => {
            
        const updatedLoops = loopData.map(p => p._id == updatedData.loopId ?              ///replace the p with updated post
            {...p, comments: updatedData.comments} : p
        )

        dispatch(setLoopData(updatedLoops))
        })

        return () => {
            socket?.off("likedLoop")
            socket?.off("commentedLoop")
        }

 
    },[socket, loopData, dispatch])

  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex
    items-center justify-center border-l-2 border-r-2
    border-gray-800 relative overflow-hidden'>

    {/* heart */}
    {showheart && 
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2
      -translate-y-1/2 heart-animation via-zinc-500'>
         <GoHeartFill className='w-[100px] drop-shadow-2xl
         h-[100px] text-white'/>
      </div>
    }

    {/* comments */}
    <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px]
      rounded-t-4xl bg-[#0e1718] transition-transform
      duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : 
      "translate-y-[100%]"}`}>
        
        <h1 className='text-white text-[20px] text-center 
        font-semibold'>Comments</h1>

          {loop.comments.length == 0 && 
            <div className='text-center 
            text-white text-[20px] font-semibold ,=mt-[50px]'>No Comments Yet</div>
          }

        <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>
          {loop.comments?.map((com, index) => (
            <div className='w-full flex flex-col gap-[5px] 
            border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]'>
              <div className='flex justify-start items-center gap-[10px] md:gap-[20px]'>
                <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black
                rounded-full cursor-pointer overflow-hidden'>
                <img src={com.author?.profileImage || dp} alt="" 
                className='w-full object-cover'/>
                </div>
                <div className='w-[150px] font-semibold text-white truncate'>{com.author.userName}</div>
              </div>
              <div className='text-white pl-[60px]'>{com.message}</div>
            </div>
          ))}
        </div>

        <div className='w-full fixed bottom-0 h-[80px] flex items-center 
        justify-between px-[10px] py-[20px]'>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black
          rounded-full cursor-pointer overflow-hidden'>
            <img src={loop.author.profileImage || dp} alt="" 
            className='w-full object-cover'/>
          </div>
          <input type="text" className='px-[10px] border-b-2
          border-b-gray-500 w-[90%] outline-none h-[40px] text-white
          placeholder:text-white' placeholder='Write comment...' 
          onChange={(e)=>setMessage(e.target.value)} value={message}/>
          <button className='absolute right-[20px] 
          cursor-pointer'><IoMdSend className='w-[25px] h-[25px] text-white' onClick={handleComment}/></button>
        </div>

    </div>
      
      <video ref={videoRef} autoPlay loop muted={isMute} src={loop?.media} 
      className='w-full max-h-[100vh]' onClick={handleClick} onTimeUpdate={handleTimeUpdate}
      onDoubleClick={handleLikeOnDoubleClick}/>
      {/* mute */}
      <div className='absolute top-[20px] z-[100] right-[20px]' onClick={()=>setIsMute(prev=>!prev)}>
          {!isMute ? <FiVolume2 className='w-[25px] h-[25px] text-white 
          font-semibold'/> : <FiVolumeX className='w-[25px] h-[25px] text-white 
          font-semibold'/>}
      </div>
      {/* progress */}
      <div className='absolute bottom-0 left-0 w-full h-[5px] bg-gray-900'>
            <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' 
            style={{width: `${progress}%`}}>

            </div>
      </div>
      {/* user */}
      <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]'>
           <div className='flex items-center gap-[10px]'>
              <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black
              rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${loop.author.userName}`)}>
                <img src={loop.author?.profileImage || dp} alt="" 
                className='w-full object-cover'/>
              </div>
              <div className='w-[120px] font-semibold truncate text-white'>{loop.author.userName}</div>
              <FollowButton targetUserId={loop.author?._id} tailwind={`px-[10px] py-[5px] text-white border-2 border-white rounded-2xl`}/>
            </div>
            <div className='text-white px-[10px]'>
              {loop.caption}
            </div>

            {/* likes/coment */}
            <div className='absolute right-0 flex flex-col gap-[20px]
            text-white bottom-[180px] justify-center px-[10px]'>

                <div className='flex flex-col items-center cursor-pointer'>
                  <div onClick={handleLike}>
                    {!loop.likes.includes(userData._id) && <GoHeart className='w-[25px]
                    cursor-pointer h-[25px]'/>}
                        {loop.likes.includes(userData._id) && <GoHeartFill className='w-[25px]
                        cursor-pointer h-[25px] text-red-600'/>}
                    </div>
                    <div>{loop.likes.length}</div>
                </div>

                <div className='flex flex-col items-center cursor-pointer' onClick={() => setShowComment(true)}>
                  <div><MdOutlineInsertComment className='w-[25px]
                  cursor-pointer h-[25px]'/></div>
                  <div>{loop.comments.length}</div>
                </div>

            </div>

      </div>
    </div>
  )
}

export default LoopCard