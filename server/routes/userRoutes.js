import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoutes } from "../middleware/authMiddleware.js";


const userRouter = express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile", protectRoutes, updateProfile )
userRouter.get("/check", protectRoutes, checkAuth)


export default userRouter;