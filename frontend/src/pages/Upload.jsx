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
    <div className='w-full min-h-screen bg-black flex flex-col items-center'>
  {/* Back button */}
  <div className='w-full h-20 flex items-center gap-4 px-4 md:px-8'>
    <MdKeyboardBackspace
      className='text-white w-6 h-6 cursor-pointer md:w-7 md:h-7'
      onClick={() => navigate(`/`)}
    />
    <h1 className='text-white text-lg md:text-xl font-semibold'>Upload Media</h1>
  </div>

  {/* Upload type selector */}
  <div className='w-[90%] max-w-2xl h-16 bg-white rounded-full flex justify-around items-center gap-2 md:gap-4 mt-4'>
    {["post", "story", "loop"].map((type) => (
      <div
        key={type}
        className={`w-1/3 h-10 flex justify-center items-center text-sm md:text-base font-semibold rounded-full cursor-pointer transition-all duration-200
        ${uploadType === type ? "bg-black text-white shadow-xl" : "hover:bg-black hover:text-white hover:shadow-xl"}`}
        onClick={() => setUploadType(type)}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    ))}
  </div>

  {/* Upload area */}
  {!frontendMedia ? (
    <div
      className='w-[90%] max-w-2xl h-64 bg-[#0e1316] border-2 border-gray-800 flex flex-col items-center justify-center gap-2 mt-12 rounded-2xl cursor-pointer hover:bg-[#353a3d]'
      onClick={() => mediaInput.current.click()}
    >
      <input
        type="file"
        accept={uploadType === "loop" ? "video/*" : ""}
        hidden
        ref={mediaInput}
        onChange={handleMedia}
      />
      <FaRegPlusSquare className='text-white w-6 h-6 md:w-7 md:h-7' />
      <div className='text-white text-base md:text-lg font-semibold'>
        Upload {uploadType}
      </div>
    </div>
  ) : (
    <div className='w-[90%] max-w-2xl h-auto flex flex-col items-center justify-center mt-12'>
      {mediaType === "image" ? (
        <div className='w-full h-auto flex flex-col items-center justify-center'>
          <img
            src={frontendMedia}
            alt=""
            className='w-full max-h-64 md:max-h-96 object-contain rounded-2xl'
          />
          {uploadType !== "story" && (
            <div className="w-full flex items-center gap-2 mt-4">
              <input
                type="text"
                className='flex-1 border-b-2 border-b-gray-400 outline-none px-2 py-1 text-white bg-transparent text-sm md:text-base'
                placeholder='Write caption'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button
                type="button"
                className="px-3 py-1 flex items-center gap-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-sm md:text-base font-semibold rounded-xl shadow-md hover:from-pink-600 hover:to-purple-600 hover:shadow-lg active:scale-95 transition"
                onClick={async () => {
                  try {
                    const formData = new FormData()
                    formData.append("media", backendMedia)
                    const result = await axios.post(`${serverUrl}/api/caption/generate`, formData, { withCredentials: true })
                    setCaption(result.data.caption || "")
                  } catch (err) {
                    console.error(err)
                    alert("Failed to generate caption")
                  }
                }}
              >
                <FaMagic className='w-4 h-4 md:w-5 md:h-5' />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='w-full h-auto flex flex-col items-center justify-center'>
          <VideoPlayer media={frontendMedia} />
          {uploadType !== "story" && (
            <input
              type="text"
              className='w-full border-b-2 border-b-gray-400 outline-none px-2 py-1 text-white mt-4 text-sm md:text-base bg-transparent'
              placeholder='Write caption'
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  )}

  {/* Upload button */}
  {frontendMedia && (
    <button
      className='px-8 md:px-20 py-2 w-[80%] max-w-md bg-white mt-8 cursor-pointer rounded-2xl text-black text-sm md:text-base flex justify-center items-center'
      onClick={handleUpload}
    >
      {loading ? <ClipLoader size={24} color='black' /> : `Upload ${uploadType}`}
    </button>
  )}
</div>

  )
}

export default Upload
