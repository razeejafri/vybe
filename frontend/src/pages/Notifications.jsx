import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
import NotificationCard from '../components/NotificationCard';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setNotificationData } from '../redux/userSlice';

function Notifications() {

    const navigate = useNavigate()

    const {userData, notificationData} = useSelector(state=>state.user)
    const dispatch = useDispatch()

    const ids = notificationData.map((n) => n._id)
    
    const markAsRead = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/markAsRead`, 
                {notificationId: ids}, 
                {withCredentials: true})
                await fetchNotification()
        } catch (error) {
            console.log(error)
        }
    }

     const fetchNotification = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, {withCredentials: true})

            dispatch(setNotificationData(result.data))
                
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        markAsRead()
    },[])

  return (
    <div className='w-full h-[100vh] bg-black overflow-auto'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'>
            <MdKeyboardBackspace className='text-white w-[25px] h-[25px] 
            cursor-pointer' onClick={()=>navigate(`/`)}/>
            <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
        </div>

        {/* notifications */}
        <div className='w-full flex flex-col gap-[20px] 
        h-[100%] px-[10px]'>
            {notificationData?.map((noti, index) => (
                <NotificationCard noti={noti} key={index}/>
            ))}
        </div>
    </div>
  )
}

export default Notifications