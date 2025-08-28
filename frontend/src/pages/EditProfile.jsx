import React, { useRef, useState } from 'react'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.jpeg"
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';

function EditProfile() {

    const { userData } = useSelector(state=>state.user)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(userData.name || "")
    const [userName, setUserName] = useState(userData.userName || "")
    const [bio, setBio] = useState(userData.bio || "")
    const [profession, setProfession] = useState(userData.profession || "")
    const [gender, setGender] = useState(userData.gender || "")

    //for image
    const [frontedImage, setFrontedImage] = useState(userData.profileImage || dp)
    const [backendImage, setBackendImage] = useState(null)
    const imageInput = useRef()
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontedImage(URL.createObjectURL(file))
    }

    const handleEditProfile = async () => {
        setLoading(true)
        try {
            const formdata = new FormData()
            formdata.append("name", name)
            formdata.append("userName", userName)
            formdata.append("bio", bio)
            formdata.append("profession", profession)
            formdata.append("gender", gender)
            if(backendImage) {
                formdata.append("profileImage", backendImage)                        //multer taking it as the name profileImage
            }

            const result = await axios.post(`${serverUrl}/api/user/editProfile`, formdata, {withCredentials: true})
            dispatch(setProfileData(result.data))
            dispatch(setUserData(result.data))
            setLoading(false)
            navigate(`/profile/:${userData.userName}`)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

  return (
    <div className='w-full min-h-[100vh] bg-black flex
    items-center flex-col gap-[20px]'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
            <MdKeyboardBackspace className='text-white w-[25px] h-[25px] 
            cursor-pointer' onClick={()=>navigate(`/profile/:${userData.userName}`)}/>
            <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
        </div>

        <div className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-black
        rounded-full cursor-pointer overflow-hidden' onClick={()=>imageInput.current.click()}>
            <input type="file" accept='image/*' ref={imageInput} hidden
            onChange={handleImage}/>
            <img src={frontedImage} alt="" 
            className='w-full object-cover'/>
        </div>

        <div className='text-blue-500 text-center text-[18px]
        font-semibold cursor-pointer' onClick={()=>imageInput.current.click()}>Change Your Profile Picture</div>
        {/* inputs */}
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010]
        border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
        outline-none' placeholder='Enter Your Name' onChange={(e)=>setName(e.target.value)} value={name}/>
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010]
        border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
        outline-none' placeholder='Enter Your userName' onChange={(e)=>setUserName(e.target.value)} value={userName}/>
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010]
        border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
        outline-none' placeholder='Bio' onChange={(e)=>setBio(e.target.value)} value={bio}/>
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010]
        border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
        outline-none' placeholder='Profession' onChange={(e)=>setProfession(e.target.value)} value={profession}/>
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010]
        border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
        outline-none' placeholder='Gender' onChange={(e)=>setGender(e.target.value)} value={gender}/>

        <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] 
        bg-[white] cursor-pointer rounded-2xl' onClick={handleEditProfile}>
        {loading ? <ClipLoader size={30} color='black'/> : "Save Profile"}</button>

    </div>
  )
}

export default EditProfile