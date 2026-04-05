import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../config/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";




// signup new user


export const signup = async(req,res) =>
{
    const { email, fullName, password, bio } = req.body;
    
    try {

        if (!fullName || !email || !password)
        {
            return res.json({success : false , message: "missing details"})
        }

        const user = await User.findOne({ email })
        if (user)
            {
            return res.json({success : false , message: "Accounts already exist with this email"})

        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({
            success: true, userData: newUser, token,
            message : "Account created successfully"
         })
        
    } catch (error) {
        console.log(error);
        
         res.json({
            success: false, 
            message : error.message
         })
    }
}


// controller for login user

export const login = async (req, res) =>
{
    
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email })
        
        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if (!isPasswordCorrect)
        {
            return res.json({ success: false, message: "Invalid credentials" })
        }

          const token = generateToken(userData._id)

        res.json({
            success: true, userData,  token,
            message : "Account login successfully"
         })
        
    } catch (error) {
        
         res.json({
            success: false, 
            message : error.message
         })

    }
}

// controller to check if user is authenticated

export const checkAuth = (req, res) =>
{
    res.json({success: true, user: req.user})
}

// controller to update user profile update

export const updateProfile = async (req, res) =>
{
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id
        // console.log("Updating profile for user:", userId);
        console.log("Received data:", { hasProfilePic: !!profilePic, bio, fullName });
        let updatedUser;
        if (profilePic)
            {
            // console.log("Uploading to cloudinary...");
            const upload = await cloudinary.uploader.upload(profilePic);
            console.log("Upload result:", upload.secure_url);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {returnDocument: 'after'})
        }
        else {
            // console.log("No profile pic, updating bio and name only");
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {returnDocument: 'after'})
        }
        // console.log("Updated user:", updatedUser);
        res.json({success :true , user: updatedUser})
        
    } catch (error) {
        console.log("Update profile error:", error.message);
        
        res.json({success : false , message : error.message})
    }
}