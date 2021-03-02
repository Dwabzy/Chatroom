
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
io = socketio(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

let socketFunctions = require('./files/socketFunctions')(io);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(path.join(__dirname, 'chatroom-app\\dist'));
app.use(express.static(path.join(__dirname, 'chatroom-app\\dist\\chatroom-app')));
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

server.listen(5000, () => console.log("Running on port 5000"))


