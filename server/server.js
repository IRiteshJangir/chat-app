import express from 'express';
import dotenv from "dotenv"
import http from "http"
import cors from "cors"
import { connectDb } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

dotenv.config()
const app = express()
const server = http.createServer(app)

// initialize socket.io
export const io = new Server(server, {
    cors : {origin : "*"}
})

// store online user

export const userSocketMap = {} // {userID : spcektId}

// socket.io connection handler

io.on("connection", (socket) => { 

    const userId = socket.handshake.query.userId;
    console.log("user connected ", userId);

    if (userId)  userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("user disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
        
        
    })


    
})


//connect to mongodb
await connectDb()
const PORT = process.env.PORT || 5000
// middleware setup

app.use(express.json({ limit: "4mb" }));
app.use(cors())

// Routes Setup
app.use("/api/status", (req, res) =>
{
    res.send("sever is live ")
})
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)




server.listen(PORT, () =>
{
    console.log("Server is running on PORT : " + PORT);
    
})