const express = require("express");
const cors = require('cors')
const app = express();
require('./config/mongoose.config');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes/user.routes")(app);

app.listen(8000, () => console.log("The server is listening at port 8000"));


const servCon = require('socket.io')(5000, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

servCon.on("connection", socket => {
    //Could save x number of messages to preload on connect
    console.log(socket.id)

    socket.on("message-toServ", data => {
        if(data.recipent === "main"){
            socket.broadcast.emit('message-toClient', data)
        } else {
            console.log('Rec: ' + data.recipent)
            //Private Message area
            socket.to(data.recipent).emit('message-toClient', data)
        }
        console.log(data.message)
    })
})