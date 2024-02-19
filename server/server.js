
import {createServer} from 'http'
import {server} from "socket.io"

const httpServer = createServer();
const io = new Server(httpServer, {});

io.on("connection", (socket)=>{
    console.log(socket);
})

httpServer.listen(3000)