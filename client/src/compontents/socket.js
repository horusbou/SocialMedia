import { io } from "socket.io-client";


const ServerURL = "http://localhost:3001";
const socket = io(ServerURL, { autoConnect: false,reconnection:false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});


export default socket;
