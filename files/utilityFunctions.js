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