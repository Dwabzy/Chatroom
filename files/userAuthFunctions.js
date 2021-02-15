const connection = require('./dbConnection');
const uuid = require('uuid-random');

//------------------------------------------------------------Create User-----------------------------------------------------------------------

exports.createUser = (firstName, lastName, email, mobileNo, username, password) => {
    let id = uuid();
    let isAdmin = false;
    let sql = `Insert into user_auth values(?, ?, ?, ?, ?, ?, ?, ?);`;
    connection.query(sql, [id, firstName, lastName, email, mobileNo, username, password, isAdmin], (err, results) => {
        if (err) return console.log(err);
        else {
            console.log("User has been created");
        }
    });
}

exports.userExists = async (username, email) => {
    let sql = 'Select * from user_auth where username=? or email=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, email], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    userId: results[0].user_id,
                    username: results[0].username,
                    password: results[0].password,
                    firstName: results[0].firstname,
                    lastName: results[0].lastname,
                    mobileNo: results[0].mobile_no,
                    emailId: results[0].email,
                    isAdmin: results[0].is_admin
                }
                resolve(responseData);
            } else resolve(false)
        });
    });
}

exports.usernameExists = async (username) => {
    let sql = 'Select * from user_auth where username=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    userId: results[0].user_id,
                    username: results[0].username,
                    password: results[0].user_pass,
                    email: results[0].user_email
                }
                resolve(responseData);
            } else resolve(false);
        });
    });
}

exports.emailExists = async (email) => {
    let sql = 'Select * from user_auth where email=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [email], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    userId: results[0].user_id,
                    username: results[0].username,
                    password: results[0].user_pass,
                    email: results[0].user_email
                }
                resolve(responseData);
            } else resolve(false);
        });
    });
}

exports.getUserDetails = (username) => {
    let sql = 'Select * from user_auth where username=?';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    userId: results[0].user_id,
                    username: results[0].username,
                    firstName: results[0].firstname,
                    lastName: results[0].lastname,
                    mobileNo: results[0].mobile_no,
                    emailId: results[0].email
                }
                resolve(responseData);
            } else resolve(false)
        });
    });
}



exports.getUserId = (chatroomId, ipAddress, visitorName) => {
    let sql = 'Select agent_id from visitors where chatroom_id=? and ip_address=? and visitor_name=?';
    return new Promise((resolve, reject) => {
        connection.query(sql, [chatroomId, ipAddress, visitorName], async (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(results[0].agent_id);
            } else {
                resolve();
            }
        });
    });
}

exports.module = {}

