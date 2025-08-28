import React, { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setNotificationData, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'

const getAllNotifications = () => {

    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    const {storyData} = useSelector(state=>state.story)
    const {postData} = useSelector(state=>state.post)

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, {withCredentials: true})

                dispatch(setNotificationData(result.data))
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchNotification()
    },[dispatch, userData])
}

export default getAllNotifications