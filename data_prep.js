const fs = require('fs');
var students = [];

function prep() {
  return new Promise((resolve, reject) => {
    try {
        fs.readFile('./students.json',(err,data)=>{
            if (err) reject("unable to read file");
            students = JSON.parse(data);
        });
    } catch (ex) {
      console.log("unable to read file");
      reject("unable to read file");
    }
    resolve();
  });
}

function cpa() {
    return new Promise((resolve, reject)=>{
        let results = students.filter(student => student.program == "CPA");
        (results.length == 0)? reject("No CPA students."):resolve(results);
     });
}

function allStudent(){
    return new Promise((resolve, reject) => {
        if (students.length>0) {
            resolve(students);
        } else reject("No students.");
    });
}

function addStudent (stud) {
    return new Promise((resolve, reject)=>{
        stud.studId = students.length+1;
        students.push(stud);
        resolve();
    });
};

function highGPA() {
    return new Promise((resolve, reject)=>{
        let high = 0;
        let highStudent;
        
        for (let i=0; i<students.length; i++)
        {
            //console.log(students[i].gpa, high);
            if (students[i].gpa > high)
            {
                high = students[i].gpa;
                highStudent = students[i];
            }
        }
        (highStudent) ? resolve(highStudent): reject("Failed finding student with highest GPA");
    }); 
}

function getStudent (studId) {
    return new Promise((resolve, reject)=>{
        students.forEach(function(student){
            if (student.studId == studId)
                resolve(student);
        });
        reject("No result found!");
    })
}

module.exports = {
    prep,
    cpa,
    highGPA,
    allStudent,
    addStudent,
    getStudent
}