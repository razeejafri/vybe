import Loop from "../models/loop.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import { getSocketId, io } from "../socket.js"
import Notification from "../models/notification.model.js"

export const uploadLoop  = async (req, res) => {
    try {
        const {caption} = req.body
        let media
        if(req.file) {
            media = await uploadOnCloudinary(req.file.path)
        } else {
            return res.status(400).json({message: `media is required`})
        }

        const loop = await Loop.create({
            caption,
            media,
            author: req.userId
        })

        const user = await User.findById(req.userId)
        user.loops.push(loop._id)
        await user.save()

        const populatedLoop = await Loop.findById(loop._id).
        populate("author", "name userName profileImage")

        return res.status(201).json(populatedLoop)

    } catch (error) {
        return res.status(500).json({message: `uploadloop  error ${error}`})
    }
}

export const like = async (req, res) => {
    try {
        const loopId = req.params.loopId
        const loop = await Loop.findById(loopId)
        if(!loop) {
            return res.status(400).json({message: "loop not found"})
        }

        const alreadyLike = loop.likes.some(id => id.toString()                                   //already
        ==req.userId.toString())

        if(alreadyLike) {
            loop.likes = loop.likes.filter(id=>id.toString() != req.userId.toString())
        } else {
            loop.likes.push(req.userId)
             //notication on like other's post rt
            if(loop.author._id != req.userId) {
                const notication = await Notification.create({
                    sender: req.userId,
                    receiver: loop.author._id,
                    type: "like",
                    loop: loop._id,
                    message: "liked your loop"
                })

                const populatedNotification = await Notification.findById(notication._id).
                populate("sender receiver loop" )

                //rt
                const receiverSocketId = getSocketId(loop.author._id)
                if(receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }

        await loop.save()
        await loop.populate("author", "name userName profileImage")

        //real time
        io.emit("likedLoop", {
            loopId: loop._id,
            likes: loop.likes
        })

        return res.status(201).json(loop)

    } catch (error) {
        return res.status(500).json({message: `likeloop error ${error}`})
    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const loopId  = req.params.loopId
        const loop = await Loop.findById(loopId)
        if(!loop) {
            return res.status(400).json({message: "loop not found"})
        }

        loop.comments.push({                                                    //edit(s)
            author: req.userId,
            message
        })

         //notication on like other's post rt
            if(loop.author._id != req.userId) {
                const notication = await Notification.create({
                    sender: req.userId,
                    receiver: loop.author._id,
                    type: "comment",
                    loop: loop._id,
                    message: "commented on your loop"
                })

                const populatedNotification = await Notification.findById(notication._id).
                populate("sender receiver loop" )

                //rt
                const receiverSocketId = getSocketId(loop.author._id)
                if(receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }

        await loop.save()
        await loop.populate("author", "name userName profileImage")
        await loop.populate("comments.author")

         //real time
        io.emit("commentedLoop", {
            loopId: loop._id,
            comments: loop.comments
        })

        return res.status(201).json(loop)

    } catch (error) {
        return res.status(500).json({message: `commentloop error ${error}`})
    }
}

export const getAllLoops = async (req, res) => {
   try {
        const loops = await Loop.find({}).
        populate("author", "name userName profileImage")
        .populate("comments.author")

        return res.status(201).json(loops)

   } catch (error) {
        return res.status(500).json({message: `getallloops error ${error}`})
   }
}