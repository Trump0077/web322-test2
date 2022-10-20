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

app.get("/allStudents", (req,res) =>{    
    data_prep.allStudent().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        res.json({message: err});
    });    
});

app.get("/addStudent", (req,res) =>{
    res.sendFile(path.join(__dirname, "/test3_views/addStudent.html"));
});

app.post("/addStudent", (req,res) => {
    data_prep.addEmployee(req.body).then(() => {
        let resText = `<h2 style="color:red"> The New Student Information: </h2>
        <p> Student ID: ${data.studId} </p>
        <p> Name:  ${data.name} </p>
        <p> Program: ${data.program} </p>
        <p> GPA: ${data.gpa} </p> `;
        res.send(resText);
    })
});

app.get("/student/:studId", (req,res) => {
    data_prep.getStudent(req.params.studId).then((data) => {
        let resText = `<h2 style="color:red"> This Student Information: </h2>
        <p> Student ID: ${data.studId} </p>
        <p> Name:  ${data.name} </p>
        <p> Program: ${data.program} </p>
        <p> GPA: ${data.gpa} </p> `;
        res.send(resText);
    }).catch((err) => {
        console.log(err);
        res.json({message: err});
    })
});

app.get("/highGPA", (req, res)=>{
    data_prep.highGPA().then((data)=>{
        let resText = `<h2> Highest GPA: </h2>
        <p> Student ID: ${data.studId} </p>
        <p> Name:  ${data.name} </p>
        <p> Program: ${data.program} </p>
        <p> GPA: ${data.gpa} </p> `;
        res.send(resText);
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