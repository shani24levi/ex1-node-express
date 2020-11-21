const fs = require('fs');

//handlers logs 
let obj_logs = {};
let logs_array = [];

const setLog = (_date, _method, _req, _res) => {
    obj_logs.date = _date;
    obj_logs.method = _method;
    obj_logs.req = _req;
    obj_logs.res = _res;
    console.log(obj_logs);

    //push object to array
    logs_array.push(obj_logs);

    //convert object into a string and ready to be sent to the file
    let log_json = JSON.stringify(obj_logs);

    //write each log in a file as a string :
    fs.appendFile("./logs.txt", log_json + "\n" , (err) => {
        if (err) { throw err };
    })
}

const getLogs = () => {
    return logs_array;
}

let my_data;
const getAllLogs = async() => {
    fs.readFile('logs.txt', 'utf8', (err, data) => {
        if (err) throw err;
        my_data =data;
        console.log(my_data);
        console.log(typeof my_data);
    });
    return my_data;
}

exports.setLog = setLog;
exports.getLogs = getLogs;
exports.getAllLogs = getAllLogs;



