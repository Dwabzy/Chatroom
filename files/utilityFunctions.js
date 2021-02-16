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

exports.getTimeMessage = (dateTime) => {
    let date = new Date(dateTime);
    let time = (new Date().getTime() - date.getTime()) / 1000;
    // Algorithm to display time
    let localDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear().toLocaleString().slice(3);
    let localTime;

    let minute = date.getMinutes();
    let hour = date.getHours()

    if (minute < 10) minute = '0' + minute;

    if (hour < 12)
        localTime = hour + ":" + minute + " am";
    else
        localTime = (hour % 12) + ":" + minute + " pm";
    // let seconds = Math.floor(time % 60);

    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600) % 24;
    let days = Math.floor(time / (24 * 3600)) % 30;
    if (days > 0) {
        return localDate + " " + localTime;
    }
    else if (hours > 0 || minutes > 1) {
        return localTime;
    }
    else if (minutes === 1) {
        return minutes + " minute ago"
    }
    else {
        return "Just now";
    }
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