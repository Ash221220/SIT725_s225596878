const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

const seats = [
  { id: 1, status: "Available" },
  { id: 2, status: "Available" },
  { id: 3, status: "Reserved" },
  { id: 4, status: "Available" },
  { id: 5, status: "Reserved" },
  { id: 6, status: "Available" }
];

io.on("connection", (socket) => {

  console.log("User connected");

  socket.emit("loadSeats", seats);

  socket.on("toggleSeat", (seatId) => {

    const seat = seats.find((s) => s.id === seatId);

    if (seat.status === "Available") {
      seat.status = "Reserved";
    } else {
      seat.status = "Available";
    }

    io.emit("seatUpdated", seats);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});