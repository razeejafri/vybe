import React from 'react';
import logo from "../assets/logo.jpg";
import { FaRegHeart } from "react-icons/fa";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import { BiMessageDetail } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const navigate = useNavigate();
  const { postData } = useSelector(state => state.post);
  const { userData, notificationData } = useSelector(state => state.user);
  const { storyList, currentUserStory } = useSelector(state => state.story);

  return (
    <div className='flex justify-center bg-gray-100 min-h-screen w-full'>

      {/* Feed Column */}
      <div className='lg:w-[50%] w-full bg-white flex flex-col min-h-screen'>

        {/* Top Nav (mobile only) */}
        <div className='w-full h-[100px] flex items-center justify-between p-5 lg:hidden bg-white shadow-md'>
          <img src={logo} alt="logo" className='w-[80px]'/>
          <div className='flex items-center gap-4'>
            <div className='relative cursor-pointer' onClick={() => navigate('/notifications')}>
              <FaRegHeart className='text-black w-6 h-6'/>
              {notificationData && notificationData.some(n => !n.isRead) && (
                <span className='w-2 h-2 bg-blue-600 rounded-full absolute top-0 right-0'/>
              )}
            </div>
            <BiMessageDetail className='text-black w-6 h-6 cursor-pointer' onClick={() => navigate("/messages")}/>
          </div>
        </div>

        {/* Stories */}
        <div className='flex w-full overflow-x-auto gap-4 items-center p-4 border-b border-gray-300'>
          <StoryDp userName={"Your Story"} ProfileImage={userData.profileImage} story={currentUserStory}/>
          {storyList?.map((story, index) => (
            <StoryDp userName={story?.author?.userName} ProfileImage={story?.author?.profileImage} story={story} key={index}/>
          ))}
        </div>

        {/* Posts */}
        <div className='w-full flex flex-col items-center gap-6 p-4 pt-6'>
          <Nav />
          {postData?.map((post, index) => (
            <Post post={post} key={index}/>
          ))}
        </div>

      </div>

      {/* Optional Right Panel (desktop only) */}
      <div className='hidden lg:flex lg:w-[25%] flex-col p-5 gap-4'>
        {/* Suggestions or extra content */}
      </div>

    </div>
  )
}

export default Feed;
