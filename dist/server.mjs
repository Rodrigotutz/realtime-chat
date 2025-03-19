"use strict";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log(`Usuario conectado: ${socket.id}`);
        socket.on("join-room", ({ room, username }) => {
            socket.join(room);
            console.log(`Usuario ${username} acessou a sala ${room}`);
            socket.to(room).emit("user_joined", `${username} acessou a sala`);
        });
        socket.on("message", ({ room, message, sender }) => {
            console.log(`Mensagem de ${sender} na sala ${room}: ${message}`);
            socket.to(room).emit("message", { sender, message });
        });
        socket.on("disconnect", () => {
            console.log(`Usuario desconectado: ${socket.id}`);
        });
    });
    httpServer.listen(port, () => {
        console.log(`Servidor rodando em: http://${hostname}:${port}`);
    });
});
