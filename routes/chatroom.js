const md5 = require('md5');
const chatroomFunctions = require('../files/chatroomFunctions');
const { getUserDetails } = require('../files/userAuthFunctions');


class UserAuth {

    constructor(app) {
        this.createChatroom(app)
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
}
module.exports = UserAuth;