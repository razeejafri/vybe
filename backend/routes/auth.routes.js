import express from "express"
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js";
import User from "../models/user.model.js";
import isAuth from "../middlewares/isAuth.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.post("/sendOtp", sendOtp)
authRouter.post("/verifyOtp", verifyOtp)
authRouter.post("/resetPassword", resetPassword)
authRouter.get("/signout", signOut)

authRouter.get("/me", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Get user error: ${error.message}` });
  }
});

export default authRouter