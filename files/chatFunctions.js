var connection = require('./dbConnection');
var { getTime } = require('./utilityFunctions');

//------------------------------------------------------------Create Visitor-----------------------------------------------------------------------

exports.addMessage = (agentId, visitorId, sender, message) => {
    let sql = `Insert into chat values(?, ?, ?, ?, ?);`;
    let timeSent = getTime();
    connection.query(sql, [agentId, visitorId, sender, message, timeSent], (err, results) => {
        if (err) return console.log(err);
        else {
            console.log("Message has been added");
        }
    });
}

exports.doesVisitorExist = (visitorIp, chatroomName) => {
    let sql = 'Select * from visitor_details where visitor_ip=? or chatroom_name=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [visitorIp, chatroomName], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    visitorId: results[0].visitor_id,
                    hasJoinedChat: results[0].has_joined_chat,
                    visitorName: results[0].visitor_name,
                    visitorDetails: JSON.parse(results[0].visitor_details)
                }
                resolve(responseData);
            } else resolve(false)
        });
    });
}

exports.getMessages = async (visitorId) => {
    let sql = 'Select * from chat where visitor_id=? order by time_sent;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [visitorId], (err, results) => {
            if (err) console.log(err);
            else {
                let messages = [];
                for (let i = 0; i < results.length; i++) {
                    let message = {
                        agentId: results[i].agent_id,
                        visitorId: results[i].visitor_id,
                        sender: results[i].sender,
                        message: results[i].message,
                        time: results[i].time_sent
                    }
                    messages.push(message)
                }
                resolve(messages);
            }
        });
    });
}

exports.getVisitorChat = () => {
    let sql = 'Select * from chat';
    return new Promise(resolve => {
        connection.query(sql, [], async (err, results) => {
            if (err) console.log(err);
            else {
                let visitorsChat = []
                for (let i = 0; i < results.length; i++) {
                    let chat = {
                        agentId: results[i].agent_id,
                        visitorId: results[i].visitor_id,
                        sender: results[i].sender,
                        message: results[i].message,
                        time: results[i].time_sent
                    }
                    visitorsChat.push(chat);
                }
                resolve(visitorsChat);
            }
        });
    });
}


