import React from 'react'
import dp from "../assets/dp.jpeg"
import FollowButton from './FollowButton'
import { useNavigate } from 'react-router-dom'

function NotificationCard({noti}) {

  const navigate = useNavigate()

  return (
    <div className='w-full flex justify-between items-center p-[5px] 
    min-h-[50px] h-[50px] bg-gray-800 rounded-full'>
        {/* sender/user */}
        <div className='flex gap-[10px] items-center'>
            <div className='w-[40px] h-[40px] border-2 border-black
            rounded-full cursor-pointer overflow-hidden' >
                <img src={noti.sender.profileImage || dp} alt="" 
                className='w-full object-cover' onClick={() => navigate(`/profile/${noti.sender.userName}`)}/>
            </div>
            <div className='flex flex-col'>
                <h1 className='text-[16px] text-white 
                font-semibold'>{noti.sender.userName}</h1>
                <div className='text-[15px] text-gray-200'>{noti.message}</div>
            </div>
        </div>
        
        {/* post/loop */}
        {(noti.post || noti.loop) && (
          <div className='w-[40px] h-[40px] rounded-full 
          overflow-hidden border-4 border-black'>

            {noti.loop
            ?
            <video src={noti?.loop?.media} muted loop className='h-full 
            object-cover'/>
            :
            noti?.post?.mediaType == "image" ?
            <img src={noti.post?.media} alt="" className='h-full object-cover'/>
            :
            noti?.post ?
            <video src={noti.post?.media} muted loop className='h-full 
            object-cover'/>
            :
            null
            }

          </div>
        )}
        
        {/* {!(noti.post || noti.loop) && (
          <div className='w-[90px] h-[35px] 
          overflow-hidden border-black'>

          <FollowButton tailwind={`px-[10px] w-full py-[5px] h-[35px] bg-white
            cursor-pointer rounded-2xl`} targetUserId={noti?.sender?._id}/>
          </div>
        )} */}

    </div>
  )
}

export default NotificationCard