import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toggleFollow } from '../redux/userSlice'

function FollowButton({targetUserId, tailwind, onFollowChange}) {

    const {following} = useSelector(state=>state.user)
    const isFollowing = following.includes(targetUserId)
    const dispatch = useDispatch()

    const handleFollow = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`,
                {withCredentials: true}
            )
            if(onFollowChange) {
                onFollowChange()
            }

            dispatch(toggleFollow(targetUserId))
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <button className={`${tailwind} relative overflow-hidden`} onClick={handleFollow}>
        {isFollowing ? "Following" : "Follow"}
        {/* Click shimmer overlay */}
        <span className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-0 active:opacity-30 rounded-full transition-all duration-200 pointer-events-none"></span>
    </button>
  )
}

export default FollowButton
