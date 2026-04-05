import User from "../models/User.js";
import jwt from "jsonwebtoken";
 

// middleware to protect routes


 
export const protectRoutes = async (req, res, next) =>
{
    try {
        const token = req.headers.token;
        console.log("Auth middleware - Token received:", !!token);
        
        if (!token) {
            return res.json({success: false , message : "No token provided"})
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user)
        {
            return res.json({ success: false, message: "User not found" })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Auth middleware error:", error.message);
        
        res.json({success: false , message : error.message})
    }
}

