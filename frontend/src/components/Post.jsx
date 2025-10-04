import React, { useState } from 'react'
import dp from "../assets/dp.jpeg"
import VideoPlayer from '../components/VideoPlayer';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { MdOutlineInsertComment } from "react-icons/md";
import { MdBookmarkBorder } from "react-icons/md";
import { MdBookmark } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoMdSend } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from "react-redux"
import { setPostData } from '../redux/postSlice'
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Post({post}) {

    const {userData} = useSelector(state => state.user)
    const {postData} = useSelector(state => state.post)                         //complete posts data
    const {socket} = useSelector(state=>state.socket)
    const dispatch = useDispatch()

    const [showComment, setShowComment] = useState(false)
    const [message, setMessage] = useState("")
    const [isSaved, setIsSaved] = useState(false)
    const navigate = useNavigate()

    const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, 
            {withCredentials: true})
            const updatedPost = result.data                                          //chnage the postData

            const updatedPosts = postData.map(p => p._id == post._id ?              ///replace the p with updated post
                updatedPost : p
            )
            dispatch(setPostData(updatedPosts))
        } catch (error) {
            console.log(error)
        }
    }

    const handleComment = async () => {
        if(!message) {
            return
        }
        try {
            const result = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, {message},
            {withCredentials: true})
            const updatedPost = result.data                                          //chnage the postData

            const updatedPosts = postData.map(p => p._id == post._id ?              ///replace the p with updated post
                updatedPost : p
            )
            dispatch(setPostData(updatedPosts))
            setMessage("")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSaved = async () => {
        setIsSaved(true)
        try {
            
            const result = await axios.get(`${serverUrl}/api/post/saved/${post._id}`,
            {withCredentials: true})
            
            dispatch(setUserData(result.data))
        } catch (error) {
            setIsSaved(false)
            console.log(error)
        }
    }

    useEffect(() => {
        socket?.on("likedPost", (updatedData) => {
            
        const updatedPosts = postData.map(p => p._id == updatedData.postId ?              ///replace the p with updated post
            {...p, likes: updatedData.likes} : p
        )

        dispatch(setPostData(updatedPosts))
        })

        socket?.on("commentedPost", (updatedData) => {
            
        const updatedPosts = postData.map(p => p._id == updatedData.postId ?              ///replace the p with updated post
            {...p, comments: updatedData.comments} : p
        )

        dispatch(setPostData(updatedPosts))
        })

        return () => {
            socket?.off("likedPost")
            socket?.off("commentedPost")
        }

 
    },[socket, postData, dispatch])

  return (
    <div className='w-[90%] flex flex-col gap-[10px]
    bg-white items-center shadow-2xl shadow-[#00000058]
    rounded-2xl pb-[20px]'>
        <div className='w-full h-[80px] flex justify-between
        items-center px-[10px]'>

            {/* profile/namefollow */}
            <div className='flex justify-center items-center gap-[10px] md:gap-[20px] cursor-pointer' onClick={()=>navigate(`/profile/${post.author?.userName}`)}>
                <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black
                rounded-full overflow-hidden'>
                    <img src={post?.author?.profileImage || dp} alt="" 
                    className='w-full object-cover'/>
                </div>
                <div className='w-[150px] font-semibold truncate'>{post.author?.userName}</div>
            </div>
            {userData?._id != post.author?._id &&
              <FollowButton
  tailwind={`
    px-3 sm:px-4 md:px-5
    min-w-[60px] sm:min-w-[90px] md:min-w-[110px]
    max-w-full
    py-2
    h-10 md:h-11
    bg-black text-white font-semibold
    rounded-full
    shadow-md
    text-sm sm:text-base md:text-lg
    text-center
    whitespace-nowrap
    overflow-hidden
    text-ellipsis
    transition-all duration-200 ease-in-out
    relative
    overflow-hidden
  `}
  targetUserId={post.author?._id}
/>








            }
            
        </div>

         {/* Post */}
        <div className='w-[90%] 
        flex items-center justify-center'>
            {post.mediaType == "image" && <div className='w-[90%]
            flex items-center justify-center '>
                <img src={post.media} alt="" className='w-[80%] rounded-2xl 
                 object-cover'/>
                
            </div> }

            {post.mediaType == "video" && <div className='w-[80%] 
            flex flex-col items-center justify-center'>
                <VideoPlayer media={post.media}/>
                
            </div> }
        </div>
        
        {/* likes/comments/save */}
        <div className='w-full h-[60px] flex justify-between 
        items-center px-[20px] mt-[10px]'>
            <div className='flex justify-center items-center gap-[10px]'>
                <div className='flex justify-center items-center gap-[5px]' > 
                    {!post.likes?.includes(userData._id) && <GoHeart className='w-[25px]
                    cursor-pointer h-[25px]' onClick={handleLike}/>}
                    {post?.likes?.includes(userData._id) && <GoHeartFill className='w-[25px]
                    cursor-pointer h-[25px] text-red-600' onClick={handleLike}/>}
                    <span>{post.likes?.length}</span>
                </div>
                <div className='flex justify-center items-center gap-[5px]' onClick={()=>setShowComment(prev => !prev)}>
                    <MdOutlineInsertComment className='w-[25px]
                    cursor-pointer h-[25px]'/>
                    <span>{post.comments?.length}</span>
                </div>
            </div>
            {/* saved */}
            <div onClick={handleSaved}>
                {!userData.saved?.includes(post?._id) && <MdBookmarkBorder className='w-[25px]
                    cursor-pointer h-[25px]'/> }
                {userData.saved?.includes(post?._id) && <MdBookmark className='w-[25px]
                    cursor-pointer h-[25px]'/>}   
            </div>
        </div>

        {/* caption */}
        {post.caption && (
  <div className="w-full px-5 py-2 flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <h1 className="font-bold truncate max-w-[150px]">
        {post.author.userName}
      </h1>
      <div className="font-serif text-gray-800 break-words">
        {post.caption}
      </div>
    </div>
  </div>
)}

        
        {/* comments */}
        {showComment && 
            <div className='w-full flex flex-col gap-[30px] pb-[20px]'>
                <div className='w-full h-[80px] flex items-center 
                justify-between px-[20px] relative'>
                    <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black
                    rounded-full cursor-pointer overflow-hidden'>
                        <img src={post.author.profileImage || dp} alt="" 
                        className='w-full object-cover'/>
                    </div>
                    <input type="text" className='px-[10px] border-b-2
                    border-b-gray-500 w-[90%] outline-none h-[40px]' placeholder='Write comment...' 
                    onChange={(e)=>setMessage(e.target.value)} value={message}/>
                    <button className='absolute right-[20px] 
                    cursor-pointer'><IoMdSend className='w-[25px] h-[25px]' onClick={handleComment}/></button>
                </div>

                {/* showing comments */}
                <div className='w-full max-h-[300px] overflow-auto'>
                    {/* img+msg */}
                    {post.comments?.map((com, index)=>(
                        <div key={index} className='w-full px-[20px] py-[20px] flex 
                        items-center gap-[20px] border-b-2 border-b-gray-200'>
                            <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black
                            rounded-full cursor-pointer overflow-hidden'>
                                <img src={com.author.profileImage || dp} alt="" 
                                className='w-full object-cover'/>
                            </div>
                            <div>{com.message}</div>
                    </div>
                    ))}
                    
                </div>

            </div>
        }

    </div>
  )
}

export default Post