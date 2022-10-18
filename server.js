const { json } = require("body-parser");
const express = require("express");
const app = express();

const path = require("path");
const data_prep = require("./data_prep.js")
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req,res) =>{
    res.sendFile(path.join(__dirname, "/home.html"));
});

app.get("/students", (req,res) =>{
    data_prep.cpa().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        res.json({ message: err });
    });
});

app.get("/highGPA", (req,res)=>{
    let resText = "<h2>Highest GPA: </h2>"
    data_prep.highGPA().then((data)=>{
        res.json(data);
    }).catch((err)=>{       
        console.log(err);
        res.json(err);
    });
});

app.use((req, res) => {
    res.status(404).send("Error 404: page not found.");
});

data_prep.prep().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log("Error: " + err);
});