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

function allStudent(){
    return new Promise((resolve, reject) => {
        if (students.length === 0) {
            reject("no results returned");
        } else {
            resolve(students.filter(() => { 
                return true; 
            }));
        }
    });
}

function addStudent (stuData) {
    stuData.studId = students.length + 1;
    students.push(stuData);

    return new Promise((resolve,reject) => {
        if (students.length === 0) {
            reject ("no results returned");
        }
        else {
            resolve(students);
        }
    })
};

function cpa() {
    return new Promise((resolve, reject) => {
        if (students.length === 0) {
            reject("no results returned");
        } else {
            resolve(students.filter(() => { 
                return true; 
            }));
        }
    });
}

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

function getStudent (value) {
    return new Promise((resolve,reject) => {
        var id = students.filter(
            student => student.studId === value
            );
        if (id.length === 0) {
            reject("no student found");
        }
        resolve(id);
    })
}

module.exports = {
    prep,
    cpa,
    highGPA,
    allStudent,
    addStudent,
    getStudent: getStudent
}