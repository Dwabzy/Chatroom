const md5 = require('md5');
const userAuthFunctions = require('../files/userAuthFunctions');


class UserAuth {

    constructor(app) {
        this.login(app);
        this.signup(app);
        this.deactivateAccount(app);
    }

    login(app) {

        app.post('/login', async (req, res) => {
            let usernameEmail = req.body.usernameEmail;
            let password = md5(req.body.password);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let userData = await userAuthFunctions.userExists(usernameEmail, usernameEmail);
            let responseData = {};
            // If Password matches with userame or email, Login is Successful and send user data.
            if (password === userData.password) {
                responseData = {
                    responseMessage: "Successfull login",
                    responseStatus: true,
                    username: userData.username,
                    userId: userData.userId,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    emailId: userData.emailId,
                    isAdmin: userData.isAdmin
                };
            }
            else {
                responseData = {
                    responseMessage: "Login failure",
                    responseStatus: false,
                };
            }
            res.send(responseData);
        });
    }

    signup(app) {
        app.post('/signup', async (req, res) => {
            const { firstName, lastName, email, mobileNo, username } = req.body;
            const password = md5(req.body.password);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            // Check if username exists
            let doesUsernameExist = await userAuthFunctions.usernameExists(username);
            let doesEmailExist = await userAuthFunctions.emailExists(email);
            let existenceData = {
                usernameExists: false,
                emailExists: false,
                existenceStatus: false
            }
            if (doesUsernameExist) {
                existenceData.usernameExists = true;
                existenceData.existenceStatus = true;
            }
            if (doesEmailExist) {
                existenceData.emailExists = true;
                existenceData.existenceStatus = true;
            }
            let responseData = {
                responseStatus: false,
                existenceData: existenceData,
            }
            if (!existenceData.existenceStatus) {
                userAuthFunctions.createUser(firstName, lastName, email, mobileNo, username, password);
                responseData.responseStatus = true;
            }
            res.json(responseData)


        });
    }

    deactivateAccount(app) {

        app.get('/deactivate-account', (req, res) => {
            let { userId } = req.query;
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            userAuthFunctions.deactivateAccount(userId);
            res.send();
        })
    }
}
module.exports = UserAuth;