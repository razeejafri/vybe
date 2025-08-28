import React, { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'

const getCurrentUser = () => {

    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    const {storyData} = useSelector(state=>state.story)
    const {postData} = useSelector(state=>state.post)

    console.log("c")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true})
                dispatch(setUserData(result.data))
                
                dispatch(setCurrentUserStory(result.data.story))
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[storyData])
}

export default getCurrentUser