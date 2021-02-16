var uuid = require('uuid-random');
var { fileRead, fileWrite, getVisitor, getTime, getTimeMessage } = require('./utilityFunctions');
var { getUserDetails } = require('./userAuthFunctions');
var { getChatroomDetails } = require('./chatroomFunctions');


let visitorChat = {
    agentId: "",
    visitorId: "",
    visitorIp: "",
    chatroomName: "",
    hasJoinedChat: false,
    visitorName: "",
    visitorDetails: {

    },
    messages: []
}


module.exports = (io) => {


    io.on('connection', async socket => {
        // Get ip of customer
        let ipAddress = socket.handshake.address;
        ipAddress = "::ffff:60.243.12.98";
        ipAddress = ipAddress.slice(7);

        // Read Messages from JSON file.
        let jsonObject = await fileRead();

        // Runs when the new connection is a new visitor.
        socket.on('new-visitor', async (chatroomName) => {
            console.log("A visitor connected with IP: ", ipAddress)
            let visitor = getVisitor(ipAddress, chatroomName, jsonObject);

            if (!visitor) {

                // If visitor does not exist in given chatroom, create new visitorInstance and send notification to agents.
                let visitorId = uuid().slice(0, 4);
                visitorChat.chatroomName = chatroomName;
                visitorChat.visitorIp = ipAddress;
                visitorChat.visitorId = visitorId;
                visitorChat.visitorName = "Visitor-" + visitorId;

                let { firstMessage } = await getChatroomDetails(chatroomName);
                visitorChat.messages = [({
                    message: firstMessage,
                    sender: "agent",
                    time: getTime()
                })]


                // Push new Visitor Object into the array
                jsonObject.push(visitorChat);

                // Connect new visitor to chatroom corresponding to their unique ID.
                socket.join(visitorId)


                // Convert array into Json string and write it to file.
                let jsonString = JSON.stringify(jsonObject, null, 2);
                fileWrite(jsonString);

                socket.emit('receive-messages', visitorChat.messages);

                // Emit to everyone except the customer that connected.
                socket.broadcast.emit('visitor-details', { ipAddress, chatroomName, visitorName: visitorChat.visitorName, messages: visitorChat.messages, visitorId });
            } else {
                // If visitor already exists, Send existig visitor details to agents.
                console.log("Visitor already exists");
                let { ipAddress, chatroomName, visitorName, messages, visitorId } = visitor;

                // Connect new visitor to chatroom corresponding to their unique ID.
                socket.join(visitorId)

                // Emit to everyone except the customer that connected.
                for (let i = 0; i < messages.length; i++)
                    messages[i].time = getTimeMessage(messages[i].time);



                socket.emit('receive-messages', messages);
                socket.broadcast.emit('visitor-details', { ipAddress, chatroomName, visitorName, messages, visitorId });
            }
        })

        // When agent connects to visitor.
        socket.on('assign-agent', async data => {
            let { username, visitorId, visitorName, chatroomName, messages } = data;

            // Get id of agent.
            let userDetails = await getUserDetails(username);
            let agentId = userDetails.userId;

            // Update visitor in file with agentId.
            let jsonObject = await fileRead();
            let visitor = jsonObject.find(visitor => visitor.visitorId === visitorId);
            let indexOfVisitor = jsonObject.indexOf(visitor);
            jsonObject[indexOfVisitor].agentId = agentId;
            jsonObject[indexOfVisitor].hasJoinedChat = true;

            // Write updated visitor to file.
            fileWrite(JSON.stringify(jsonObject, null, 2));


            socket.join(visitorId);
            socket.to(visitorId).emit('agent-connected', { username, agentId, visitorId, visitorName, chatroomName })
        })

        socket.on('get-connected-visitors-request', async username => {
            // Get id of agent.
            let userDetails = await getUserDetails(username);
            let agentId = userDetails.userId;

            // Get visitor assigned to given agent and emit it to Connected Visitors list.
            let jsonObject = await fileRead();
            let visitors = jsonObject.filter(visitor => visitor.agentId === agentId);

            socket.emit('receive-connected-visitors-list', visitors);
        });

        socket.on('get-unconnected-visitors-request', async () => {
            // Get visitor assigned to given agent and emit it to Connected Visitors list.
            let jsonObject = await fileRead();
            let visitors = jsonObject.filter(visitor => !visitor.hasJoinedChat);

            socket.emit('receive-unconnected-visitors-list', visitors);
        });

        socket.on('get-messages', async visitorId => {
            let jsonObject = await fileRead();
            let visitor = jsonObject.find(visitor => visitor.visitorId === visitorId);
            let messages = visitor.messages;

            for (let i = 0; i < messages.length; i++)
                messages[i].time = getTimeMessage(messages[i].time);

            socket.emit('receive-messages', messages);
        });

        socket.on('send-message', async data => {
            let { message, sender, visitorId } = data;

            // Create message object
            let messageObject = {
                message,
                sender,
                time: getTime()
            }

            // Read file and find the chat of given visitor Id.
            let jsonObject = await fileRead();
            let visitor = jsonObject.find(visitor => visitor.visitorId === visitorId);
            let indexOfVisitor = jsonObject.indexOf(visitor);

            // Connect to chatroom again, just in case.
            socket.join(visitorId);
            var users = io.sockets.adapter.rooms.get(visitorId);
            console.log(users);

            // Push the message Object onto the file and write it.
            jsonObject[indexOfVisitor].messages.push(messageObject);
            fileWrite(JSON.stringify(jsonObject, null, 2));

            messageObject.time = getTimeMessage(messageObject.time);
            // Use IO to send to all connections in the chatroom.
            io.to(visitorId).emit('receive-message', messageObject);
        })

        socket.on('agent-join-room', (visitorId) => {

            socket.join(visitorId)
            var users = io.sockets.adapter.rooms.get(visitorId);
            console.log(users);
        })


        // Runs when client disconnects
        socket.on('disconnect', () => {
            console.log("A user disconnected");
            io.emit('message', 'User has left the chat');
        })

    })

}