import React, { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { setPrevChatUsers } from '../redux/messageSlice'

const getPrevChatUsers = () => {

    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    const {messages} = useSelector(state=>state.message)
    const {postData} = useSelector(state=>state.post)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/message/prevChats`, {withCredentials: true})
                dispatch(setPrevChatUsers(result.data))
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[messages])
}

export default getPrevChatUsers