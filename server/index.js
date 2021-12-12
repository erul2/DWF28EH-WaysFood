const express = require("express");
const router = require("./src/routes");
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // we must define cors because our client and server have diffe
  },
});

// import socket function and call with parameter io
//require("./src/socket")(io);
io.on("connection", async (socket) => {
  // join room
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  console.log("socket connection established " + roomId);

  // listen new notifications from user to admin
  socket.on("newNotif", (data) => {
    io.in("adminNotif").emit("newNotif", data.body);
    console.log("new notif for admin " + data.body);
  });

  // listen new notifications from admin to user
  socket.on("newUserNotif", (data) => {
    const trxId = data.body.id;
    io.in(trxId).emit("newNotif", data.body);
    console.log("admin send notif to user " + trxId);
  });

  // leave the room
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

const port = 5000;

// Endpoint grouping and router
app.use("/api/v1/", router);

server.listen(port, () => console.log(`Listening on port ${port}!`));
