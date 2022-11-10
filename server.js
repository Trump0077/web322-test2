const { json } = require("body-parser");
const express = require("express");
const exphbs = require('express-handlebars');
const app = express();

const path = require("path");
const data_prep = require("./data_prep.js")
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs', exphbs.engine({ 
    extname: ".hbs", 
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>'; 
            },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }           
    } 
}));

app.set('view engine', '.hbs');

app.get("/", (req,res) =>{
    res.send('Results will be displayed here');
});

app.get("/CPA", (req,res)=>{
    data_prep.cpa().then((data)=>{       
        var txt =  ` Student List:  </h2>
        <table>           
            <tr>
                <td>StudentId</td>
                <td>${data.studId}</td>
            </tr>
                <td>Name</td>
                <td>${data.name}</td>
            </tr>
                <td>Program</td>
                <td>${data.program}</td>
            </tr>
                <td>GPA</td> 
                <td>${data.gpa}</td>                       
            </tr>           
        </table>
        `;
        res.send(txt);
    }).catch((reason)=>{
        res.json({message:reason});
    });
});

app.get("/allStudents", (req,res) =>{    
    data_prep.allStudent().then((data)=>{
        res.render("students",{students: data});
    }).catch((err)=>{
        res.render({message: "no results"});
    });    
});

app.get("/addStudent", (req,res) =>{
    res.sendFile(path.join(__dirname, "/test3_views/addStudent.html"));
});

app.post("/addStudent", (req,res) => {
    data_prep.addStudent(req.body).then(()=>{
        var data = req.body;
        var txt =  ` Student Info:  </h2>
        <p> Student id: ${data.studId}</p>
        <p> Student name: ${data.name} </p>
        <p> Program: ${data.program} </p>
        <p> GPA: ${data.gpa} </p>
        `;
        res.send(txt);
    }).catch((reason)=>res.json({message:reason}));
});

app.get("/student/:studId", (req,res) => {
    data_prep.getStudent(req.params.studId).then((data)=>{
        res.render("student",{student: data});
    }).catch((err)=>{
        res.render({message: "no results"});
    });
});

app.get("/highGPA", (req, res)=>{
    data_prep.highGPA().then((data)=>{
        let resText = `<h2> Student Info: </h2>
        <p> Student ID: ${data.studId} </p>
        <p> Name:  ${data.name} </p>
        <p> Program: ${data.program} </p>
        <p> GPA: ${data.gpa} </p> `;
        res.send(resText);
    });
});

app.get("*", (req, res)=>{
    res.status(404).send("Error 404: page not found.")
});

data_prep.prep().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log("Error: " + err);
});