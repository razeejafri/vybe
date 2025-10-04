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
   <div className='w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] flex flex-col gap-4
    bg-white rounded-2xl shadow-md pb-4 mx-auto mt-4'>

  {/* Header: profile + follow */}
  <div className='w-full flex justify-between items-center px-3 py-2'>
    <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0 cursor-pointer' onClick={() => navigate(`/profile/${post.author?.userName}`)}>
      <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0'>
        <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
      </div>
      <div className='flex flex-col min-w-0'>
        <span className='font-semibold text-sm sm:text-base truncate'>{post.author?.userName}</span>
      </div>
    </div>
    {userData?._id !== post.author?._id && (
      <FollowButton
        tailwind={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-black text-white rounded-2xl shadow-sm hover:shadow-md`}
        targetUserId={post.author?._id}
      />
    )}
  </div>

  {/* Media */}
  <div className='w-full flex justify-center items-center bg-black rounded-t-2xl overflow-hidden'>
    {post.mediaType === "image" ? (
      <img
        src={post.media}
        alt=""
        className='w-full h-auto max-h-[500px] md:max-h-[600px] object-contain'
      />
    ) : (
      <div className='w-full h-auto max-h-[500px] md:max-h-[600px]'>
        <VideoPlayer media={post.media} />
      </div>
    )}
  </div>

  {/* Actions: like, comment, save */}
  <div className='w-full flex justify-between items-center px-3 py-2'>
    <div className='flex gap-4 items-center'>
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

    <div onClick={handleSaved} className='cursor-pointer'>
      {!userData.saved?.includes(post?._id) ? (
        <MdBookmarkBorder className='w-6 h-6 sm:w-7 sm:h-7' />
      ) : (
        <MdBookmark className='w-6 h-6 sm:w-7 sm:h-7' />
      )}
    </div>
  </div>

  {/* Caption */}
  {post.caption && (
    <div className='w-full px-3 sm:px-4 text-sm sm:text-base'>
      <span className='font-semibold mr-2'>{post.author.userName}</span>
      <span>{post.caption}</span>
    </div>
  )}

  {/* Comments */}
  {showComment && (
    <div className='w-full flex flex-col gap-3 px-3 sm:px-4 mt-2'>
      {/* Add Comment Input */}
      <div className='flex items-center gap-2 w-full'>
        <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0'>
          <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover' />
        </div>
        <input
          type='text'
          className='flex-1 border-b-2 border-gray-300 outline-none px-2 py-1 text-sm sm:text-base'
          placeholder='Add a comment...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleComment}>
          <IoMdSend className='w-6 h-6 sm:w-7 sm:h-7 text-blue-500 cursor-pointer' />
        </button>
      </div>

      {/* Existing Comments */}
      <div className='max-h-60 md:max-h-80 overflow-auto flex flex-col gap-2 mt-2'>
        {post.comments?.map((com, idx) => (
          <div key={idx} className='flex items-start gap-2'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0'>
              <img src={com.author.profileImage || dp} alt="" className='w-full h-full object-cover' />
            </div>
            <div className='text-sm sm:text-base'>
              <span className='font-semibold mr-1'>{com.author.userName}</span>
              {com.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>



  )
}

export default Post
