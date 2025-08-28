import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import { getSocketId, io } from "../socket.js"
import Notification from "../models/notification.model.js"

export const uploadPost  = async (req, res) => {
    try {
        const {caption, mediaType} = req.body
        let media
        if(req.file) {
            media = await uploadOnCloudinary(req.file.path)
        } else {
            return res.status(400).json({message: `media is required`})
        }

        const post = await Post.create({
            caption,
            media,
            mediaType,
            author: req.userId
        })

        const user = await User.findById(req.userId)
        user.posts.push(post._id)
        await user.save()

        const populatedPost = await Post.findById(post._id).
        populate("author", "name userName profileImage")

        return res.status(201).json(populatedPost)

    } catch (error) {
        return res.status(500).json({message: `uploadPost error ${error}`})
    }
}

export const getAllPosts = async (req, res) => {
   try {
        const posts = await Post.find({}).
        populate("author", "name userName profileImage").
        populate("comments.author", "name userName profileImage").
        sort({createdAt: -1})

        return res.status(201).json(posts)

   } catch (error) {
        return res.status(500).json({message: `getallPost error ${error}`})
   }
}

export const like = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(400).json({message: "post not found"})
        }

        const alreadyLike = post.likes.some(id => id.toString()                                   //already
        ==req.userId.toString())

        if(alreadyLike) {
            post.likes = post.likes.filter(id=>id.toString() != req.userId.toString())
        } else {
            post.likes.push(req.userId)
            //notication on like other's post rt
            if(post.author._id != req.userId) {
                const notication = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "like",
                    post: post._id,
                    message: "liked your post"
                })

                const populatedNotification = await Notification.findById(notication._id).
                populate("sender receiver post" )

                //rt
                const receiverSocketId = getSocketId(post.author._id)
                if(receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }

        await post.save()
        await post.populate("author", "name userName profileImage")
        
        //real time
         io.emit("likedPost", {
            postId: post._id,
            likes: post.likes
         })

        return res.status(201).json(post)

    } catch (error) {
        return res.status(500).json({message: `likePost error ${error}`})
    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const postId  = req.params.postId
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(400).json({message: "post not found"})
        }

        post.comments.push({                                                    //edit(s)
            author: req.userId,
            message
        })

         //notication on comments other's post rt
            if(post.author._id != req.userId) {
                const notication = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "comment",
                    post: post._id,
                    message: "commented on your post"
                })

                const populatedNotification = await Notification.findById(notication._id).
                populate("sender receiver post" )

                //rt
                const receiverSocketId = getSocketId(post.author._id)
                if(receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }

        await post.save()
        await post.populate("author", "name userName profileImage")
        await post.populate("comments.author")

        //real time
         io.emit("commentedPost", {
            postId: post._id,
            comments: post.comments
         })

        return res.status(201).json(post)

    } catch (error) {
        return res.status(500).json({message: `commentPost error ${error}`})
    }
}

export const saved = async (req, res) => {
    try {

        const postId = req.params.postId
        const post = await Post.findById(postId)
        const user = await User.findById(req.userId)
        if(!post) {
            return res.status(400).json({message: "post not found"})
        }

        if(!user){
            return res.status(400).json({message: "user not found"})
        }

        const alreadySaved = user.saved.some(id => id.toString()                                   //already
        ==postId.toString())

        if(alreadySaved) {
            user.saved = user.saved.filter(id=>id.toString() != postId.toString())
        } else {
            user.saved.push(req.params.postId)
        }

        await user.save()
        // await user.populate("saved")
        await user.populate({
            path: "saved",
            populate: {path: "author", select: "name userName profileImage"}
        })
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message: `savedPost error ${error}`})
    }
}