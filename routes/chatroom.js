var chatroomFunctions = require('../files/chatroomFunctions');
var { getUserDetails } = require('../files/userAuthFunctions');
var { getVisitorDetails } = require('../files/visitorFunctions');
var { getVisitorChat } = require('../files/chatFunctions');



class Chatroom {

    constructor(app) {
        this.createChatroom(app);
        this.displayChatrooms(app);
        this.getVisitorDetails(app);
        this.viewChat(app);
    }

    createChatroom(app) {
        app.post('/createChatroom', async (req, res) => {
            let {
                username,
                chatroomName,
                firstMessage,
                onlineMessage,
                offlineMessage,
                idleMessage,
                entityList,
                chatboxTheme } = req.body;
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let { userId } = await getUserDetails(username);
            chatroomFunctions.createChatroom(
                userId,
                chatroomName,
                firstMessage,
                onlineMessage,
                offlineMessage,
                idleMessage,
                JSON.stringify(entityList),
                JSON.stringify(chatboxTheme));

            res.send(true);
        })
    }


    displayChatrooms(app) {
        app.get('/myChatrooms', async (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let myChatrooms = await chatroomFunctions.displayChatrooms();
            console.log(myChatrooms, myChatrooms.length);
            res.send(myChatrooms);
        })
    }

    getVisitorDetails(app) {
        app.get('/getVisitorDetails', async (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let visitorDetails = await getVisitorDetails();
            res.send(visitorDetails);
        })
    }

    viewChat(app) {
        app.get('/viewChat', async (req, res) => {

            let { visitorId } = req.query;
            console.log(visitorId);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let chat = await getVisitorChat(visitorId);
            console.log(chat);
            res.send(chat);
        })
    }
}
module.exports = Chatroom;