
var express = require('express');
var session = require('express-session');
var path = require('path');
var http = require('http');
var socketio = require('socket.io');
var cors = require('cors');
var uuid = require('uuid-random');

var userAuth = require('./routes/userAuth');
var chatroom = require('./routes/chatroom');



var app = express();
app.use(cors());
var server = http.createServer(app);
var io = socketio(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});



io.on('connection', socket => {
  // Get ip of customer
  let ipAddress = socket.handshake.address;
  console.log("A user connected with IP: ", ipAddress)

  // Emit to everyone except the customer that connected.
  let visitorId = uuid().slice(0, 4);
  socket.broadcast.emit('new-user', { visitorId, ipAddress });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log("A user disconnected");
    io.emit('message', 'User has left the chat');
  })
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'chatroom projecto with angular',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: (1825 * 86400 * 1000),
    httpOnly: false
  }
}));

new userAuth(app);
new chatroom(app);

server.listen(3000, () => console.log("Running on port 3000"))

