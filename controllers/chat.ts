import { Server } from 'socket.io'
const chat = (io: Server) => {
    io.use((socket, next) => {
        const user = socket.handshake.auth.user;
        if (user) {
            //@ts-ignore
            socket.session_id = user.session;
            //@ts-ignore
            socket.user_id = user.user_id;
            //@ts-ignore
            socket.user = user;
            return next()
        }
        if (!user) {
            return next(new Error("invalid user"));
        }

    })
    io.on("connection", (socket) => {
        console.log("socket id", socket.id);
        //@ts-ignore
        socket.join(socket.user_id)
        socket.emit("session", {
            //@ts-ignore
            session_id: socket.session_id,
            //@ts-ignore
            user_id: socket.user_id,
            //@ts-ignore
            user: socket.user
        })
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on('private message', ({ content, to }) => {
            const message = {
                content,
                //@ts-ignore
                from: socket.user_id,
                to,
                //@ts-ignore
                user: socket.user
            }
            //@ts-ignore
            socket.to(to).to(socket.user_id).emit("private message", message);
            //@ts-ignore
            // console.log("private message", { message, to, from: socket.user_id, user: socket.user });
        })
    });
};
export default chat;
