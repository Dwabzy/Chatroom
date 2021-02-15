var file = require('fs');

exports.getTime = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const seconds = today.getSeconds()
    return yyyy + '-' + mm + '-' + dd + " " + hour + ':' + minute + ':' + seconds;
}

exports.fileRead = () => {
    return new Promise(resolve => {
        file.readFile('./files/messages.json', (err, results) => {
            if (err) console.log(err);
            resolve(JSON.parse(results));
        })
    })
}

exports.fileWrite = (jsonString) => {
    file.writeFile('./files/messages.json', jsonString, (err) => {
        if (err) console.log(err);
    })
}

exports.getVisitor = (ipAddress, chatroomName, jsonObject) => {
    return jsonObject.find(visitorChat => ipAddress === visitorChat.visitorIp && chatroomName === visitorChat.chatroomName);
}