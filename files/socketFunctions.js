var uuid = require('uuid-random');
var { getTime, getTimeMessage } = require('./utilityFunctions');
var { getUserDetails, getAgentName } = require('./userAuthFunctions');
var { getChatroomDetails } = require('./chatroomFunctions');
var { createVisitor, doesVisitorExist, assignAgent, getAssignedAgentId, getConnectedVisitors,
    getUnconnectedVisitors, setVisitorOffline, setVisitorOnline, getOnlineVisitors } = require('./visitorFunctions');
var { addMessage, getMessages } = require('./chatFunctions');


module.exports = (io) => {


    io.on('connection', async socket => {
        // Get ip of customer
        let ipAddress = socket.handshake.address;
        ipAddress = "::ffff:60.243.12.98";
        ipAddress = ipAddress.slice(7);

        // Runs when the new connection is a new visitor.
        socket.on('new-visitor', async (chatroomName) => {
            console.log("A visitor connected with IP: ", ipAddress)
            let visitor = await doesVisitorExist(ipAddress, chatroomName);
            if (!visitor) {

                // If visitor does not exist in given chatroom, create new visitorInstance and send notification to agents.
                let visitorId = uuid().slice(0, 4);
                let visitorName = "Visitor-" + visitorId;
                let visitorDetails = JSON.stringify({});

                let { firstMessage } = await getChatroomDetails(chatroomName);

                // Add first message to visitor chat. Empty Quotes mean that the message was sent by the server/ Bot
                addMessage("", visitorId, "agent", firstMessage);

                // Create a visitor record in the visitor_details table.
                createVisitor("", visitorId, ipAddress, chatroomName, false, visitorName, visitorDetails, true)


                // Connect new visitor to chatroom corresponding to their unique ID.
                socket.join(visitorId)

                let messages = await getMessages(visitorId);

                // Display time
                messages[0].displayTime = true;
                messages[0].timeMessage = getTimeMessage(messages[0].time, true);

                socket.emit('receive-messages', messages);


                // Emit to everyone except the customer that connected.
                io.emit('visitor-details', { ipAddress, chatroomName, visitorName, messages, visitorId });
            } else {
                // If visitor already exists, Send existig visitor details to agents.
                console.log("Visitor already exists");
                let { visitorName, visitorId, agentId } = visitor;


                // Get the name of the agent.
                let agentName = await getAgentName(agentId);

                // Set visitor's status as online
                setVisitorOnline(visitorId);

                // Connect new visitor to chatroom corresponding to their unique ID.
                socket.join(visitorId)
                let messages = await getMessages(visitorId);

                for (let i = 0; i < messages.length; i++) {
                    let date = new Date(messages[i].time);

                    // Get the string to be displayed under the message as time sent.
                    messages[i].timeMessage = getTimeMessage(messages[i].time, (i + 1) === messages.length);
                    messages[i].displayTime = true;

                    // Algorithm to display the time.
                    let currentSender = messages[i].sender;
                    let timeDifference = 0;
                    if (messages[i + 1]) {
                        timeDifference = Math.floor((new Date(messages[i + 1].time).getTime() - date.getTime()) / 60 / 1000);
                    }

                    /* Display Time only if the time difference between consecutive messages is greater than 5 minutes or if the sender of 2 consecutive
                    messages is different */
                    if (messages[i + 1] && currentSender === messages[i + 1].sender && timeDifference < 5) {
                        messages[i].displayTime = false;
                    }
                }

                socket.emit('receive-messages', messages);
                io.emit('visitor-details', { agentName, ipAddress, chatroomName, visitorName, messages, visitorId });
            }
        })

        // When agent connects to visitor.
        socket.on('assign-agent', async data => {
            let { username, visitorId, visitorName, chatroomName } = data;

            // Get id of agent.
            let userDetails = await getUserDetails(username);
            let agentId = userDetails.userId;

            console.log(agentId, visitorId);

            // Update visitor in file with agentId.
            assignAgent(agentId, visitorId);

            socket.join(visitorId);
            socket.to(visitorId).emit('agent-connected', { username, agentId, visitorId, visitorName, chatroomName })
        })

        socket.on('get-connected-visitors-request', async username => {
            // Get id of agent.
            let userDetails = await getUserDetails(username);
            let agentId = userDetails.userId;

            // Get visitor assigned to given agent and emit it to Connected Visitors list.
            let visitors = await getConnectedVisitors(agentId);

            socket.emit('receive-connected-visitors-list', visitors);
        });

        socket.on('get-unconnected-visitors-request', async () => {
            // Get visitors who are not assigned to any agents and emit it to unconnected Visitors list.
            let visitors = await getUnconnectedVisitors();
            console.log("Visitors: ", visitors);
            socket.emit('receive-unconnected-visitors-list', visitors);
        });

        socket.on('get-messages', async visitorId => {
            let messages = await getMessages(visitorId);


            for (let i = 0; i < messages.length; i++) {
                let date = new Date(messages[i].time);

                // Get the string to be displayed under the message as time sent.
                messages[i].timeMessage = getTimeMessage(messages[i].time, (i + 1) === messages.length);
                messages[i].displayTime = true;

                // Algorithm to display the time.
                let currentSender = messages[i].sender;
                let timeDifference = 0;
                if (messages[i + 1]) {
                    timeDifference = Math.floor((new Date(messages[i + 1].time).getTime() - date.getTime()) / 60 / 1000);
                }

                /* Display Time only if the time difference between consecutive messages is greater than 5 minutes or if the sender of 2 consecutive
                messages is different */
                if (messages[i + 1] && currentSender === messages[i + 1].sender && timeDifference < 5) {
                    messages[i].displayTime = false;

                }
            }
            socket.emit('receive-messages', messages);
        });

        socket.on('get-all-messages', async (username) => {
            let userDetails = await getUserDetails(username);
            let agentId = userDetails.userId;

            let allMessages = [];
            let onlineVisitors = await getOnlineVisitors(agentId);

            for (let i = 0; i < onlineVisitors.length; i++) {
                let messages = await getMessages(onlineVisitors[i].visitorId);

                for (let j = 0; j < messages.length; j++) {
                    let date = new Date(messages[j].time);

                    // Get the string to be displayed under the message as time sent.
                    messages[j].timeMessage = getTimeMessage(messages[j].time, (j + 1) === messages.length);
                    messages[j].displayTime = true;

                    // Algorithm to display the time.
                    let currentSender = messages[j].sender;
                    let timeDifference = 0;
                    if (messages[j + 1]) {
                        timeDifference = Math.floor((new Date(messages[j + 1].time).getTime() - date.getTime()) / 60 / 1000);
                    }

                    /* Display Time only if the time difference between consecutive messages is greater than 5 minutes or if the sender of 2 consecutive
                    messages is different */
                    if (messages[j + 1] && currentSender === messages[j + 1].sender && timeDifference < 5) {
                        messages[j].displayTime = false;

                    }
                }
                allMessages.push({ visitorId: onlineVisitors[i].visitorId, messages });
            }
            socket.emit('receive-all-messages', allMessages);
        })

        socket.on('send-message', async data => {
            let { message, sender, chatroomName, visitorId } = data;
            let ipAddress = socket.handshake.address;
            if (!visitorId) {
                let visitorDetails = await doesVisitorExist(ipAddress, chatroomName);
                visitorId = visitorDetails.visitorId;
            }

            // Connect to chatroom again, just in case.
            socket.join(visitorId);

            // var users = io.sockets.adapter.rooms.get(visitorId);
            // console.log(users);

            // Create message object
            let messageObject = {
                visitorId,
                message,
                sender,
                time: getTime(),
            }

            // get id of the assigned agent
            let agentId = await getAssignedAgentId(visitorId);

            // Add message to chat table.
            addMessage(agentId, visitorId, sender, message);

            messageObject.timeMessage = getTimeMessage(messageObject.time, true);
            messageObject.displayTime = true;
            // Use IO to send to all connections in the chatroom.
            io.to(visitorId).emit('receive-message', messageObject);
        })

        socket.on('agent-join-room', (visitorId) => {
            console.log(socket.id);
            socket.join(visitorId)
            var users = io.sockets.adapter.rooms.get(visitorId);
            console.log("Connect:", users);
        })


        // Runs when client disconnects
        socket.on('disconnect', () => {
            console.log("A user disconnected");
        })

        // Listens to when a visitor disconnects.
        socket.on('disconnect-visitor', (visitorId) => {
            setVisitorOffline(visitorId);
        })

    })

}