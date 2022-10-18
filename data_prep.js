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
    return new Promise((resolve, reject) => {
        const highGPA = students.filter((student) => {
            return Math.max.apply(Math,this.students.map(students => {
                return students.gpa;
            }));
        });
        if (highGPA) {
            resolve(highGPA);
        } else {
            reject("Failed finding the student with the highest GPA");
        }
    });
}

module.exports = {
    prep,
    cpa,
    highGPA
}