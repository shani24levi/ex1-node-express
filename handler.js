// Logic
const colors = require('colors');
const express = require('express');
const { getLogs, setLog ,getAllLogs } = require("./logs");
const router = express.Router();

//Get json data and save as array object
const data = require('./data/users.json');
let users = data;

//object saves time and date for logs information:
let date;

// GET all users. 
router.get('/', (req, res, next) => {
    date = new Date();
    setLog(date, "GET", "/users", "200 OK");
    return res.send(users);
});

//GET user by id
router.get("/user/:id", (req, res) => {
    let user = req.params.id;

    //filter to new array by url param
    let user_filter = users.filter(item => item.id == user)
    console.log(user_filter);
    date = new Date();
    //if empty then res a masage:
    if (user_filter.length == 0) {
        setLog(date, "GET", `/users/user/${user}`, "404 Not Found");
        return res.status(404).send({ message: `No User Found By id: ${user}` });
    }
    setLog(date, "GET", `/users/user/${user}`, "200 OK");
    return res.status(200).send(user_filter);
});

//POST: add user and push to local array.
router.post("/add", (req, res) => {
    let user = {};
    user.id = users[users.length - 1].id + 1;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.gender = req.body.gender;
    user.country = req.body.country;
    user.color = req.body.color;

    //Check that all data of object 'user' is indicated on the requst -> all required!!
    if (!item.color || !item.country || !item.gender || !item.email || !item.last_name || !item.first_name) {
        setLog(date, "POST", `/users/add`, `401 Missing Data`);
        return res.status(401).send({ message: `Missing Data` });
    }

    date = new Date();

    //Check email exists
    users.map(item => {
        (item.email == user.email) ? user.email = false : user.email;
        if (!user.email) {
            setLog(date, "POST", `/users/add`, "401 Allrady Exist");
            return res.status(401).send({ error: "Email allrady exist" });
        }
    })

    users.push(user);
    setLog(date, "POST", `/users/add`, "200 OK");
    return res.send(user);
});

//GET: find users by contry
router.get("/country/:country", (req, res) => {
    let users_country = req.params.country;

    //filter to new array by url param
    let user_filter = users.filter(item => item.country == users_country)
    console.log(user_filter);

    date = new Date();

    //if empty then res a masage:
    if (user_filter.length == 0) {
        setLog(date, "GET", `/users/country/${users_country}`, "404 Not Found");
        return res.status(404).send({ massag: `No User Found By ${users_country}` });
    }
    setLog(date, "GET", `/users/country/${users_country}`, "200 OK");
    return res.status(200).send(user_filter);
});

//POST (can be PUT)
router.post("/edit", (req, res) => {
    let user = {};
    user.id = req.body.id;
    user.found = false;

    date = new Date();

    //Check user id exists
    users.map(item => {
        if (item.id == user.id) {
            user.found = true;
            item.first_name = req.body.first_name;
            item.last_name = req.body.last_name;
            item.email = req.body.email;
            item.gender = req.body.gender;
            item.country = req.body.country;
            item.color = req.body.color;

            //Check that all data of object 'user' is indicated on the requst
            if (!item.color || !item.country || !item.gender || !item.email || !item.last_name || !item.first_name) {
                setLog(date, "POST", `/users/edit`, `401 Missing Data`);
                return res.status(401).send({ message: `Missing Data` });
            }
            setLog(date, "POST", `/users/edit`, "200 OK");
            return res.status(200).send(item);
        }
    })
    //else user not found.
    if (!user.found) {
        setLog(date, "POST", `/users/edit`, "404 Not Found");
        return res.status(404).send({ message: `No User Found By id: ${user.id}` });
    }

});

//DELET user by id
router.delete("/:id", (req, res) => {
    let user_id = req.params.id;
    let user = {};
    user.id = Number(user_id); //params is string and in users.json id type is number.
    user.found = false;

    date = new Date();

    //Check user id exists
    users.map((item, i) => {
        if (item.id == user.id) {
            user.found = true;
            user.email = item.email;
            users.splice(i, 1); //set the array with out the user;
            setLog(date, "DELETE", `/users/${user_id}`, "200 OK");
            return res.status(200).send({ message: `User : ${user.email} has deleted` });
        }
    })
    //else user not found.
    if (!user.found) {
        setLog(date, "DELETE", `/users/${user_id}`, "404 Not Found");
        return res.status(404).send({ message: `No User Found By id: ${user.id}` });
    }
});

// GET loges (all logs when sever start)
router.get('/logs', (req, res, next) => {
    let logs = getLogs();
    return res.status(200).send(logs);
});

// GET loges (all logs ever from file)
router.get('/all/logs', async(req, res, next) => {
    let logs = await getAllLogs();
    console.log(logs);
    return res.status(200).send(logs);
});

// GET error if url is not one of the options
router.get('*', (req, res, next) => {
    date = new Date();
    setLog(date, "GET", `/users/*`, "401 Request not valid");
    console.log(colors.red.bold("Request not valid"))
    return res.status(401).send({ masage: "Request not valid" });
});

module.exports = router;