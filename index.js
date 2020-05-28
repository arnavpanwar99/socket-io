const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

let interval;

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello')
});

io.on('connection', (socket) => {
    if(interval){
        clearInterval(interval);
    }
    interval = setInterval(() => {
        getApiAndEmit(socket);
    }, 1000);
    socket.on('disconnect', () => {
        console.log('client disconnected');
        clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const response = new Date();

    //emitting a new message will be consumed by the client
    socket.emit("FromAPI", response);
};

http.listen(port, () => console.log(`server up on ${port}`));