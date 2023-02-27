
const servCon = require('socket.io')(5000, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

servCon.on("connection", socket => {
    console.log(socket.id)

    socket.on("message-toServ", data => {
        if(data.recipent === "main"){
            socket.broadcast.emit('message-toClient', data)
        } else {
            console.log('Rec: ' + data.recipent)
            socket.to(data.recipent).emit('message-toClient', data)
        }
        console.log(data.message)
    })
})