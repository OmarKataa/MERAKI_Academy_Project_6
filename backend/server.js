//====================================================//Require
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const PORT = 5000;
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
// ===================================================//create server

const server = http.createServer(app);
const io = socket(server, { cors: { origin: "*" } });

//====================================================//import database

const connection = require("./database/db");

//====================================================// Import Routers
const adminRouter = require("./Routes/Admin");
const teacherRouter = require("./Routes/Teacher");
const studentRouter = require("./Routes/Student");
const courseRouter = require("./Routes/Course");
const roleRouter = require("./Routes/Role");
const LoginRouter = require("./Routes/Login");
const req = require("express/lib/request");
//====================================================// Routes Middleware
app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);
app.use("/course", courseRouter);
app.use("/role", roleRouter);
app.use("/login", LoginRouter);

//====================================================// Handles any other endpoints [unassigned - endpoints]
app.use("*", (req, res) => res.status(404).json("NO content at this path"));

server.listen(PORT, () => {
  console.log(`SERVER WORKING ON PORT: ${PORT}`);
});

// ============================
// ===================================================
io.on("connection", (socket) => {
  console.log(`connected ${socket.id}`);

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    socket.broadcast.emit("callEnded");
  });
  // ===========================================join room
  socket.on("join_room", (data) => {
    socket.join(`${data}`);
    console.log("join_room", data);
  });

  // // ===============================================messages
  socket.on("message", (data) => {
    io.in("omar").emit("message", "success");
    console.log(data);
  });

  // =================================================== video

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.in(data.to).emit("callAccepted", data.signal);
  });
});
