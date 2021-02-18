const bodyparser = require('body-parser');
const express = require('express');
const server = express();
const path = require('path');

/* MongoDB functions - Begin */
const mongoose = require('mongoose');
const dburl = "mongodb://localhost:27017/assign6"

mongoose.connect(dburl, (err, result) => {
    if (err) {
        console.log("unable to connect to database");
    }
    else {
        console.log("connected to database");
    }
});

let bugSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    assignee: { type: String, required: true }
});

let bugModel = mongoose.model('bugs', bugSchema);

const createBug = (data) => {
    return new Promise((resolve, reject) => {
        var validatedata = new bugModel(data);
        validatedata.save().then((result) => {
            console.log("data is saved into database");
            resolve(result);
        }).catch((error) => {
            console.log("error in saving data to database");
            reject(error);
        });
    });
}

const getAllBugs = () => {
    const query = {};
    bugModel.find(query).then((result) => {
        console.log("bugs: ", result);
    }).catch((error) => {
        console.log("unable to get records from database: ", error);
    });
}

/* MongoDB functions - End */

server.use(bodyparser.json());
server.use(express.static(path.resolve(__dirname, 'frontend')));

server.get("/", (req, res) => {
    console.log("get route /");

    res.sendStatus(200);
});

server.post("/createBug", (req, res) => {
    console.log(req.body);
    createBug(req.body)
        .then((result) => {
            console.log(result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        });
});

server.get("/getAllBugs", (req, res) => {
    getAllBugs(req.body)
    res.sendStatus(200);
});

server.get('/*', (req, res) => {
    console.log(__dirname + '/frontend/index.html');
    res.status(200).sendFile(__dirname + '/frontend/index.html');
});

server.listen(3000, (err) => {
    if (err) throw err;

    console.log("Server is listening...");
});
