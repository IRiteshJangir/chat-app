import jwt from "jsonwebtoken";

// function to generate a token for a user


export const generateToken = (UserId) =>
{
    const token = jwt.sign({ userId: UserId }, process.env.JWT_SECRET, { expiresIn: "7d" })
    
    return token
}

