// socket

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());
// middleware end

app.get("/", (req, res) => {
})


users = [];
connections = [];

io.on('connection', socket => {

    connections.push(socket);
    socket.emit('socketID', socket.id);
    io.emit('list', users);

    socket.on("register", data => {
        users.push({ id: socket.id, name: data });

        socket.emit('socketID', { id: data });
        console.log(users);
        io.emit('list', users);

    })

    socket.on('message', data => {
        if (connections.length > 1) {
            console.log(data);
            let ind = connections.find(c => c.id === data.to.id);
            console.log(ind.id);
            ind.emit("message", { id: socket.id, message: data.message });
        }
    });

    socket.on('disconnect', () => {
        let id = socket.id;
        let acc = users.find(u => {
            return u.id === id;
        })
        if (acc) {
            users.splice(users.indexOf(acc), 1);
        }
        connections.splice(connections.indexOf(socket), 1);
        io.emit('list', users);
    });

});



server.listen(3000);


// socket







