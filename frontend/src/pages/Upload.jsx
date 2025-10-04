import React, { useRef, useState } from 'react'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FaRegPlusSquare } from "react-icons/fa";
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';
import { FaMagic } from "react-icons/fa";  // 👈 Magic icon

function Upload() {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [uploadType, setUploadType] = useState("post")
  const [caption, setCaption] = useState("")

  const dispatch = useDispatch()
  const {userData} = useSelector(state=>state.user)
  const {postData} = useSelector(state=>state.post)
  const {loopData} = useSelector(state=>state.loop)

  const [frontendMedia, setFrontendMedia] = useState(null)                                
  const [backendMedia, setBackendMedia] = useState(null)                                  
  const [mediaType, setMediaType] =useState("")                                          
  const mediaInput = useRef()

  const handleMedia = (e) => {
    const file = e.target.files[0]
    if(file.type.includes("image")) {
      setMediaType("image")
    } else {
      setMediaType("video")
    }
    setBackendMedia(file)
    setFrontendMedia(URL.createObjectURL(file))
  }

  const uploadPost = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("caption", caption)
      formData.append("mediaType", mediaType)
      formData.append("media", backendMedia) 

      const result = await axios.post(`${serverUrl}/api/post/upload`,formData, {withCredentials: true})
      dispatch(setPostData([...postData, result.data]))
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const uploadStory = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("mediaType", mediaType)
      formData.append("media", backendMedia) 

      const result = await axios.post(`${serverUrl}/api/story/upload`,
        formData, {withCredentials: true}
      )
      dispatch(setCurrentUserStory(result.data))
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const uploadLoop = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("caption", caption)
      formData.append("media", backendMedia) 

      const result = await axios.post(`${serverUrl}/api/loop/upload`,
        formData, {withCredentials: true}
      )
      dispatch(setLoopData([...loopData, result.data]))
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleUpload = () => {
    if(uploadType == "post") {
      uploadPost()
    } else if(uploadType == "story") {
      uploadStory()
    } else {
      uploadLoop()
    }
  }

  return (
    <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
      {/* back */}
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
        <MdKeyboardBackspace className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate(`/`)}/>
        <h1 className='text-white text-[20px] font-semibold'>Upload media</h1>
      </div>

      <div className='w-[90%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]'>
        <div className={`${uploadType == "post" ? "bg-black text-white shadow-2xl shadow-black" : ""} 
          w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} 
          onClick={()=>setUploadType("post")}>Post</div>

        <div className={`${uploadType == "story" ? "bg-black text-white shadow-2xl shadow-black" : ""} 
          w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} 
          onClick={()=>setUploadType("story")}>Story</div>

        <div className={`${uploadType == "loop" ? "bg-black text-white shadow-2xl shadow-black" : ""} 
          w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} 
          onClick={()=>setUploadType("loop")}>Loop</div>
      </div>

      {!frontendMedia &&
        <div className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]' 
          onClick={()=>mediaInput.current.click()}>             
          <input type="file" accept={uploadType=="loop"?"video/*":""} hidden ref={mediaInput} onChange={handleMedia}/>
          <FaRegPlusSquare className='text-white w-[25px] h-[25px] cursor-pointer'/>
          <div className='text-white text-[19px] font-semibold'>Upload {uploadType}</div>
        </div> 
      }

      {frontendMedia &&
        <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
          { mediaType == "image" && 
            <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
              <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl'/>
              {uploadType != "story" && (
                <>
                  {/* Caption input + Auto Generate Button in one line */}
                  <div className="w-full flex items-center gap-2 mt-[20px]">
                    <input 
                      type="text" 
                      className='flex-1 border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white bg-transparent'
                      placeholder='write caption' 
                      onChange={(e)=>setCaption(e.target.value)}
                      value={caption}
                    />

                    <button 
                      type="button"
                      className="
  px-3 py-2 flex items-center gap-1
  bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
  text-white text-sm font-semibold rounded-xl
  shadow-md shadow-purple-400/50
  hover:from-pink-600 hover:to-purple-600
  hover:shadow-lg hover:shadow-pink-400/60
  active:scale-95
  transition transform duration-200 ease-in-out
  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1
"

                      onClick={async () => {
                        try {
                          const formData = new FormData();
                          formData.append("media", backendMedia);
                          const result = await axios.post(`${serverUrl}/api/caption/generate`, formData, { withCredentials: true });
                          console.log("Caption generation result:", result.data);
                          setCaption(result.data.caption || "");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to generate caption");
                        }
                      }}
                    >
                      <FaMagic className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div> 
          }

          { mediaType == "video" && 
            <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
              <VideoPlayer media={frontendMedia}/>
              {uploadType != "story" && 
                <input 
                  type="text" 
                  className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]' 
                  placeholder='write caption' 
                  onChange={(e)=>setCaption(e.target.value)} 
                  value={caption}
                />
              }
            </div> 
          }
        </div>
      }

      {frontendMedia && 
        <button 
          className='px-[100px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white] mt-[50px] cursor-pointer rounded-2xl' 
          onClick={handleUpload}
        >
          {loading ? <ClipLoader size={30} color='black'/> : `Upload ${uploadType}`}
        </button>
      }
    </div>
  )
}

export default Upload
