var uuid = require('uuid-random');
var connection = require('../files/dbConnection');
var { getTime } = require('./utilityFunctions');


exports.createChatroom =
    (
        userId,
        chatroomName,
        firstMessage,
        onlineMessage,
        offlineMessage,
        idleMessage,
        entityList,
        chatboxTheme) => {
        let chatroomId = uuid();
        let timeModified = getTime();
        let sql = `Insert into chatroom values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        connection.query(sql, [
            userId,
            chatroomId,
            chatroomName,
            firstMessage,
            onlineMessage,
            offlineMessage,
            idleMessage,
            entityList,
            chatboxTheme,
            timeModified], (err, results) => {
                if (err) return console.log(err);
                else {
                    console.log("Chatroom has been created");
                }
            });
    }


exports.getAllChatrooms = (userId) => {
    let sql = 'Select * from chatroom where user_id=?';
    return new Promise((resolve, reject) => {
        connection.query(sql, [userId], async (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(results);
            } else resolve(false)
        });
    });
}

exports.getVerifiedChatrooms = (userId) => {
    let sql = 'Select distinct(chatroom_id) from visitors where agent_id=?';
    return new Promise((resolve, reject) => {
        connection.query(sql, [userId], async (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let value = [];
                for (let i = 0; i < results.length; i++) {
                    let temp = await this.getChatrooms(results[i].chatroom_id);
                    value.push(temp);
                }
                resolve(value)
            } else resolve(false)
        });
    });
}

exports.getChatrooms = async (chatroomId) => {
    let sql = 'Select * from chatroom where chatroom_id=?';
    return new Promise((resolve, reject) => {
        connection.query(sql, [chatroomId], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(results[0]);
            } else resolve(false)
        });
    });
}

exports.displayChatrooms = async () => {
    let sql = 'Select * from chatroom;';
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(results);
            } else resolve(false)
        });
    });
}


exports.getChatroomDetails = (chatroomName) => {
    let sql = 'Select * from chatroom where chatroom_name=?';
    return new Promise(resolve => {
        connection.query(sql, [chatroomName], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    chatroomId: results[0].chatroom_id,
                    chatroomName: results[0].chatroom_name,
                    firstMessage: results[0].first_message,
                    onlineMessage: results[0].online_message,
                    onlineMessage: results[0].online_message,
                    onlineMessage: results[0].online_message
                }
                resolve(responseData);
            } else resolve(false)
        });
    });
}


exports.getChatroomFullDetails = (chatroomId) => {
    let sql = 'Select * from chatroom where chatroom_id=?';
    return new Promise(resolve => {
        connection.query(sql, [chatroomId], async (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    chatroomId: results[0].chatroom_id,
                    chatroomName: results[0].chatroom_name,
                    description: results[0].descrption,
                    firstMessage: results[0].first_message,
                    onlineMessage: results[0].online_message,
                    offlineMessage: results[0].offline_message,
                    idleMessage: results[0].idle_message,
                    entityList: results[0].entityList,
                    chatboxTheme: results[0].chatbox_theme,
                }
                resolve(responseData);
            } else resolve(false)
        });
    });
}


exports.getViewChat = (visitorId) =>{
    console.log(visitorId);
    let sql = 'Select * from chat where visitor_id=?';
    return new Promise(resolve => {
        connection.query(sql,[visitorId], async (err, results) => {
            if (err) console.log(err);
            else{
                resolve(results);
            }
        });
    });
}

