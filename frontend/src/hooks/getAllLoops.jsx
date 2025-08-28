import React, { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice'
import { setLoopData } from '../redux/loopSlice';

const getAllLoops = () => {

    const dispatch = useDispatch()
    const {userData} = useSelector(state => state.user)

    useEffect(() => {
        const fetchloops = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/loop/getAll`, {withCredentials: true})
                dispatch(setLoopData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchloops()
    },[dispatch, userData])
}

export default getAllLoops