import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {

    console.log("Connected");

});

socket.on("room:booked", (room) => {

    console.log("BOOKED", room);

});

socket.on("room:cancelled", (room) => {

    console.log("CANCELLED", room);

});