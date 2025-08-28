import React, { useEffect, useState } from 'react'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import dp from "../assets/dp.jpeg"

function Search() {

    const navigate = useNavigate()
    const [input, setInput] = useState("")

    const dispatch = useDispatch()
    const {searchData} = useSelector(state => state.user)

    const handleSearch = async () => {
        // e.preventDefault()
        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyWord=${input}`,
                {withCredentials: true}
            )

            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
   
        if (input) {
            handleSearch();
        } 
}, [input]);

  return (
    <div className='w-full min-h-[100vh] bg-black flex
    items-center flex-col gap-[20px]'>
        <div className='w-full h-[80px] flex items-center gap-[20px] 
        px-[20px]'>
            <MdKeyboardBackspace className='text-white w-[25px] h-[25px] 
            cursor-pointer' onClick={()=>navigate(`/`)}/>     
        </div>

        <div className='w-full h-[80px] flex items-center justify-center'>
            <form className='w-[90%] max-w-[800px] h-[80%] rounded-full 
            bg-[#0f1414] px-[20px] flex items-center'>
                <FiSearch className='text-white w-[18px] h-[18px] 
                cursor-pointer'/>
                <input type="text" placeholder='search...' className='
                w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px]' 
                onChange={(e)=>setInput(e.target.value)} value={input}/>
            </form>
        </div>

        {input && searchData?.map((user)=>(
            <div key={user._id} className='w-[90vw] max-w-[700px] h-[60px] rounded-full
            bg-white flex items-center gap-[20px] px-[5px] hover:bg-gray-200
            cursor-pointer' onClick={()=> navigate
            (`/profile/${user.userName}`)}>
                <div className='w-[50px] h-[50px] border-2 border-black
                rounded-full overflow-hidden' >
                    <img src={user.profileImage || dp} alt="" 
                    className='w-full object-cover'/>
                </div>

                <div className='text-black text-[18px] font-semibold'>
                    <div>{user.userName}</div>
                    <div className='text-[14px] text-gray-400'>{user.name}</div>
                </div>

            </div>
        )) 
        }
        
        {!input &&
            <div className='text-[30px] text-gray-700 font-bold'>
                Search Here...
            </div>
        }

    </div>
  )
}

export default Search