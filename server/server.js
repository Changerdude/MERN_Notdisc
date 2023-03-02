const express = require("express");
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser');
const credentials = require("./config/credentials.config");
const corsOptions = require('./config/corsOptions.config');
require('./config/mongoose.config');

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require("./routes/user.routes")(app);

app.listen(8000, () => console.log("The server is listening at port 8000"));


const servCon = require('socket.io')(5000, {
    cors: {
        origin: ['http://localhost:3000']
    }
})
const users = {};
servCon.on("connection", socket => {
    if(socket.handshake.query.username !== undefined) users[socket.handshake.query.username] = socket.id;

    servCon.emit('current-user-list' , Object.keys(users))

    socket.on("message-toServ", data => {
        if(data.room === "main"){
            socket.broadcast.emit('message-toClient', data)
        } else {
            console.log('Rec: ' + data.room)
            data.to = data.room;
            data.room = data.sender;
            socket.to(users[data.to]).emit('message-toClient', data)
        }
    })

    socket.on('disconnect' , () => {
        console.log("someone disconnected")
        for( [key,value] of Object.entries(users)){
            if(value === socket.id){
                delete users[key];
            }
        }
        servCon.emit('current-user-list' , Object.keys(users))
    })
}) 