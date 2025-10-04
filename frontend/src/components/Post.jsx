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
    <div className='w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] flex flex-col gap-4
    bg-white items-center shadow-2xl shadow-[#00000058]
    rounded-2xl pb-5 mx-auto'>

  {/* Profile / Name / Follow */}
  <div className='w-full h-auto flex justify-between items-center px-2 md:px-4 py-2'>
    <div
      className='flex items-center gap-2 sm:gap-4 cursor-pointer'
      onClick={() => navigate(`/profile/${post.author?.userName}`)}
    >
      <div className='w-10 h-10 sm:w-14 sm:h-14 border-2 border-black rounded-full overflow-hidden'>
        <img
          src={post?.author?.profileImage || dp}
          alt=""
          className='w-full h-full object-cover'
        />
      </div>
      <div className='font-semibold text-sm sm:text-base md:text-lg truncate max-w-[120px] sm:max-w-[150px]'>
        {post.author?.userName}
      </div>
    </div>

    {userData?._id !== post.author?._id && (
      <FollowButton
        tailwind={`px-3 sm:px-4 py-1 sm:py-2 min-w-[60px] sm:min-w-[100px] h-8 sm:h-10 bg-black text-white rounded-2xl text-sm sm:text-base`}
        targetUserId={post.author?._id}
      />
    )}
  </div>

  {/* Post Media */}
  <div className='w-full flex justify-center items-center'>
    {post.mediaType === "image" && (
      <img
        src={post.media}
        alt=""
        className='w-full sm:w-[90%] md:w-[80%] lg:w-[70%] rounded-2xl object-contain'
      />
    )}
    {post.mediaType === "video" && (
      <div className='w-full sm:w-[90%] md:w-[80%] lg:w-[70%]'>
        <VideoPlayer media={post.media} />
      </div>
    )}
  </div>

  {/* Likes / Comments / Save */}
  <div className='w-full flex justify-between items-center px-4 py-2'>
    <div className='flex gap-4 sm:gap-6 items-center'>
      <div className='flex items-center gap-2'>
        {!post.likes?.includes(userData._id) ? (
          <GoHeart className='w-6 h-6 sm:w-7 sm:h-7 cursor-pointer' onClick={handleLike} />
        ) : (
          <GoHeartFill className='w-6 h-6 sm:w-7 sm:h-7 text-red-600 cursor-pointer' onClick={handleLike} />
        )}
        <span className='text-sm sm:text-base'>{post.likes?.length}</span>
      </div>
      <div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
        <MdOutlineInsertComment className='w-6 h-6 sm:w-7 sm:h-7' />
        <span className='text-sm sm:text-base'>{post.comments?.length}</span>
      </div>
    </div>

    <div onClick={handleSaved}>
      {!userData.saved?.includes(post?._id) ? (
        <MdBookmarkBorder className='w-6 h-6 sm:w-7 sm:h-7 cursor-pointer' />
      ) : (
        <MdBookmark className='w-6 h-6 sm:w-7 sm:h-7 cursor-pointer' />
      )}
    </div>
  </div>

  {/* Caption */}
  {post.caption && (
    <div className='w-full px-4 py-2 flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <h1 className='font-bold truncate max-w-[120px] sm:max-w-[150px] text-sm sm:text-base'>
          {post.author.userName}
        </h1>
        <div className='font-serif text-gray-800 break-words text-sm sm:text-base'>
          {post.caption}
        </div>
      </div>
    </div>
  )}

  {/* Comments */}
  {showComment && (
    <div className='w-full flex flex-col gap-4 pb-4'>
      <div className='w-full flex items-center justify-between relative'>
        <div className='w-10 h-10 sm:w-14 sm:h-14 border-2 border-black rounded-full overflow-hidden'>
          <img src={post.author.profileImage || dp} alt="" className='w-full h-full object-cover' />
        </div>
        <input
          type='text'
          className='flex-1 mx-2 border-b-2 border-gray-500 outline-none h-10 px-2 text-sm sm:text-base'
          placeholder='Write comment...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='absolute right-2 sm:right-4'>
          <IoMdSend className='w-6 h-6 sm:w-7 sm:h-7 cursor-pointer' onClick={handleComment} />
        </button>
      </div>

      <div className='w-full max-h-72 sm:max-h-80 overflow-auto'>
        {post.comments?.map((com, index) => (
          <div key={index} className='w-full flex items-center gap-4 border-b-2 border-gray-200 px-4 py-2'>
            <div className='w-10 h-10 sm:w-14 sm:h-14 border-2 border-black rounded-full overflow-hidden'>
              <img src={com.author.profileImage || dp} alt="" className='w-full h-full object-cover' />
            </div>
            <div className='text-sm sm:text-base'>{com.message}</div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

  )
}

export default Post
