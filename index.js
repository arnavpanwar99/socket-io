const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

const { addUser, removeUser, getUser, getUserInRoom } = require('./users');

const port = process.env.PORT || 3001;

const { router } = require('./router');

app.use(cors());

io.on('connection', socket => {
    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({name, room, id: socket.id});
        if(error){
            return callback(error);
        };

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined!`});

        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)})

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users:getUserInRoom(user.room)});

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left the chat.`});
        }
    });
});

app.use(router);

http.listen(port, () => console.log(`server up on ${port}`));