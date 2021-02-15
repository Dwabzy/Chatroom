var uuid = require('uuid-random');
var { fileRead, fileWrite, getVisitor, getTime } = require('./utilityFunctions');
var { getUserDetails } = require('./userAuthFunctions');


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
        ipAddress = "::ffff:60.243.12.97";
        ipAddress = ipAddress.slice(7);


        // Read Messages from JSON file.
        let jsonObject = await fileRead();
        let visitorId = uuid().slice(0, 4);
        let visitorName = "Visitor-" + visitorId;
        let messages = [];

        socket.on('new-visitor', async (chatroomName) => {
            console.log("A visitor connected with IP: ", ipAddress)
            let visitor = getVisitor(ipAddress, chatroomName, jsonObject);
            let visitorSocketId = socket.id
            console.log("Socket ID:", socket.id, visitorSocketId);

            if (!visitor) {
                visitorChat.chatroomName = chatroomName;
                visitorChat.visitorIp = ipAddress;
                visitorChat.visitorId = visitorId;
                visitorChat.visitorName = visitorName

                // Push new Visitor Object into the array
                jsonObject.push(visitorChat);

                // Convert array into Json string and write it to file.
                let jsonString = JSON.stringify(jsonObject, null, 2);
                fileWrite(jsonString);
                // Emit to everyone except the customer that connected.
                socket.broadcast.emit('visitor-details', { ipAddress, chatroomName, visitorName, messages, visitorSocketId });
            } else {
                console.log("Visitor already exists");
                let { ipAddress, chatroomName, visitorName, messages } = visitor;
                if (!visitor.hasJoinedChat)
                    socket.broadcast.emit('visitor-details', { ipAddress, chatroomName, visitorName, messages, visitorSocketId });
                else {
                    socket.broadcast.emit('new-visitor-socket-id', { visitorName, visitorSocketId });
                }
            }

        })

        socket.on('get-unconnected-visitors-request', () => {
            let unconnectedVisitors = jsonObject.filter(visitorChat => !visitorChat.hasJoinedChat)
            socket.emit('send-unconnnected-visitors', unconnectedVisitors);
        })

        socket.on('get-connected-visitors-request', async (username) => {
            let userDetails = await getUserDetails(username);
            let agentId = userDetails.userId;
            let connectedVisitors = jsonObject.filter(visitorChat => visitorChat.hasJoinedChat && visitorChat.agentId === agentId);
            socket.emit('send-connnected-visitors', connectedVisitors);
        })

        socket.on('connect-to-visitor', async (data) => {
            let { username, visitorId, visitorSocketId, agentSocketId } = data;
            // Get Agent ID from database
            let userDetails = await getUserDetails(username);
            let agentId = userDetails.userId;

            // Get all messages from json file and find the visitor that the agent wants to chat to.
            let jsonObject = await fileRead();

            let visitor = jsonObject.find(visitorChat => visitorId === visitorChat.visitorId)
            let index = jsonObject.indexOf(visitor);

            // Remove Visitor from visitorsList as they have already been assigned an agent.
            jsonObject[index].hasJoinedChat = true;
            jsonObject[index].agentId = agentId;

            // Finally, write to file.
            fileWrite(JSON.stringify(jsonObject, null, 2));
            console.log("VisitorId:", visitorId);
            socket.to(visitorSocketId).emit('connected-message', { agentId, visitorId, visitorSocketId, agentSocketId });
        });



        socket.on('agent-message', async data => {
            let { message, chatDetails } = data;
            let { visitorSocketId, agentSocketId, visitorId } = chatDetails;
            console.log("Socket 2:", visitorSocketId, socket.id, agentSocketId);
            let sender = "agent";
            let time = getTime();
            socket.to(visitorSocketId).emit('receive-agent-message', { message, sender, time })

            // Write messages to file.
            let jsonObject = await fileRead();
            let visitor = jsonObject.find(visitorChat => visitorId === visitorChat.visitorId);
            let index = jsonObject.indexOf(visitor);
            jsonObject[index].messages.push({ message, sender, time });
            fileWrite(JSON.stringify(jsonObject, null, 2));
        })

        socket.on('visitor-message', async data => {
            let { message, chatDetails } = data;
            let { visitorSocketId, agentSocketId, visitorId } = chatDetails;
            console.log("Socket 2:", visitorSocketId, socket.id, agentSocketId);
            let sender = "visitor";
            let time = getTime();
            socket.to(agentSocketId).emit('receive-visitor-message', { message, sender, time })

            // Write messages to file.
            let jsonObject = await fileRead();
            let visitor = jsonObject.find(visitorChat => visitorId === visitorChat.visitorId);
            let index = jsonObject.indexOf(visitor);
            jsonObject[index].messages.push({ message, sender, time });
            fileWrite(JSON.stringify(jsonObject, null, 2));
        })

        // Runs when client disconnects
        socket.on('disconnect', () => {
            console.log("A user disconnected");
            io.emit('message', 'User has left the chat');
        })

    })

}