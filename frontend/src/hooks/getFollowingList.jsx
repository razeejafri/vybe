import React, { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'

const getFollowingList = () => {

    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    const {storyData} = useSelector(state=>state.story)
    const {postData} = useSelector(state=>state.post)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/followingList`, {withCredentials: true})
                
                dispatch(setFollowing(result.data))
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[storyData])
}

export default getFollowingList