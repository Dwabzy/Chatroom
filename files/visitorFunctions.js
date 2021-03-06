const connection = require('./dbConnection');

//------------------------------------------------------------Create Visitor-----------------------------------------------------------------------

exports.createVisitor = (assignedAgentId, visitorId, visitorIp, chatroomName, hasJoinedChat, visitorName, visitorDetails, onlineStatus) => {
    let sql = `Insert into visitor_details values(?, ?, ?, ?, ?, ?, ?, ?);`;
    connection.query(sql, [assignedAgentId, visitorId, visitorIp, chatroomName, hasJoinedChat, visitorName, visitorDetails, onlineStatus], (err, results) => {
        if (err) return console.log(err);
        else {
            console.log("Visitor has been created");
        }
    });
}

exports.doesVisitorExist = (visitorIp, chatroomName) => {
    console.log(visitorIp,chatroomName);
    let sql = 'Select * from visitor_details where visitor_ip=? and chatroom_name=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [visitorIp, chatroomName], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    agentId: results[0].assigned_agent_id,
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

exports.setVisitorOffline = (visitorId) => {
    let sql = 'update visitor_details set online=false where visitor_id=?;';
    connection.query(sql, [visitorId], (err, results) => {
        if (err) console.log(err);
        else {
            console.log(`Visitor is offline`,visitorId);
        }
    })
}

exports.setVisitorOnline = (visitorId) => {
    let sql = 'update visitor_details set online=true where visitor_id=?;';
    connection.query(sql, [visitorId], (err, results) => {
        if (err) console.log(err);
        else {
            console.log(`Visitor is online`, visitorId);
        }
    })
}

exports.assignAgent = async (agentId, visitorId) => {
    let sql = 'update visitor_details set assigned_agent_id=?, has_joined_chat=true where visitor_id=?;';
    connection.query(sql, [agentId, visitorId], (err, results) => {
        if (err) console.log(err);
        else {
            console.log(`Agent ${agentId} has been assigned to ${visitorId}`)
        }
    });
}

exports.getAssignedAgentId = async (visitorId) => {
    let sql = 'select assigned_agent_id from visitor_details where visitor_id=?;';
    return new Promise(resolve => {
        connection.query(sql, [visitorId], (err, results) => {
            if (err) console.log(err);
            else resolve(results[0].assigned_agent_id);
        })
    })
}

exports.getUnconnectedVisitors = async () => {
    let sql = 'select * from visitor_details where has_joined_chat=false and online=true;';
    return new Promise(resolve => {
        connection.query(sql, [], (err, results) => {
            if (err) console.log(err);
            else {
                let unconnectedVisitors = [];
                for (let i = 0; i < results.length; i++) {
                    let visitor = {
                        visitorId: results[i].visitor_id,
                        visitorName: results[i].visitor_name,
                        visitorIp: results[i].visitor_ip,
                        visitorDetails: results[i].visitor_details,
                        chatroomName: results[i].chatroom_name,
                        agentId: results[i].assigned_agent_id
                    }
                    unconnectedVisitors.push(visitor)
                }
                resolve(unconnectedVisitors);
            }
        })
    })
}

exports.getConnectedVisitors = async (agentId) => {
    let sql = 'select * from visitor_details where has_joined_chat=true and assigned_agent_id=?;';
    return new Promise(resolve => {
        connection.query(sql, [agentId], (err, results) => {
            if (err) console.log(err);
            else {
                let connectedVisitors = [];
                for (let i = 0; i < results.length; i++) {
                    let visitor = {
                        visitorId: results[i].visitor_id,
                        visitorName: results[i].visitor_name,
                        visitorIp: results[i].visitor_ip,
                        visitorDetails: results[i].visitor_details,
                        chatroomName: results[i].chatroom_name,
                        agentId: results[i].assigned_agent_id
                    }
                    connectedVisitors.push(visitor)
                }
                resolve(connectedVisitors);
            }
        })
    })
}

exports.getOnlineVisitors = (agentId) => {
    let sql = 'select * from visitor_details where assigned_agent_id=? and online=true;';
    return new Promise(resolve => {
        connection.query(sql, [agentId], async (err, results) => {
            if (err) console.log(err);
            else {
                let visitorDetails = []
                for (let i = 0; i < results.length; i++) {
                    let visitor = {
                        chatroomName: results[i].chatroom_name,
                        visitorDetails: results[i].visitor_details,
                        visitorId: results[i].visitor_id,
                        visitorIp: results[i].visitor_ip,
                        visitorName: results[i].visitor_name
                    }
                    visitorDetails.push(visitor);
                }
                resolve(visitorDetails);
            }
        });
    });
}


exports.getVisitorDetails = () => {
    let sql = 'Select * from visitor_details';
    return new Promise(resolve => {
        connection.query(sql, [], async (err, results) => {
            if (err) console.log(err);
            else {
                let visitorDetails = []
                for (let i = 0; i < results.length; i++) {
                    let visitor = {
                        chatroomName: results[i].chatroom_name,
                        visitorDetails: results[i].visitor_details,
                        visitorId: results[i].visitor_id,
                        visitorIp: results[i].visitor_ip,
                        visitorName: results[i].visitor_name
                    }
                    visitorDetails.push(visitor);
                }
                resolve(visitorDetails);
            }
        });
    });
}



