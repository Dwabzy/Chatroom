const mysql = require('mysql');

const connection = mysql.createConnection({
    // host: "mydbinstance-18945.c0k7mpe1hdnq.us-west-1.rds.amazonaws.com",
    // user: "admin",
    // password: "maazhussain",
    host: "localhost",
    user: "maaz",
    password: "root",
    database: "chatroom"
});


// To print stack trace of fatal error
var del = connection._protocol._delegateError;
connection._protocol._delegateError = function (err, sequence) {
    if (err.fatal) {
        console.trace('fatal error: ' + err.message);
    }
    return del.call(this, err, sequence);
};


connection.connect(function (err) {
    if (err) console.log("Database connection unsuccessful!");
    else console.log("Database connected successfully");
});

module.exports = connection;