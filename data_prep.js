const Sequelize = require('sequelize');

var sequelize = new Sequelize('txyhlccz', 'txyhlccz', 'P4VZB1rurHhz34ndQItOjJO_rV1Ry3yq', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },
    query:{raw: true} 
});

sequelize.authenticate().then(()=> console.log('Connection success.')) 
.catch((err)=>console.log("Unable to connect to DB.", err));

const Student = sequelize.define('student', {
    StudId: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:Sequelize.STRING,
    program:Sequelize.STRING,
    gpa:Sequelize.FLOAT,
});

exports.prep = ()=>{
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(resolve())
        .catch(reject('unable to sync the database'));
    })
}

exports.addStudent= (stud)=>{
    return new Promise((resolve,reject) => {
        for (var i in stud) {
            if (stud[i] == "") { 
                stud[i] = null;
            }
        }
        Student.create(stud)
        .then(resolve(Student.findAll()))
        .catch(reject('unable to add the student'))
    })
}

exports.cpa = ()=>{
    return new Promise((resolve, reject)=>{
        Student.findAll({
            where:{
                program: 'cpa'
            }
        })
        .then(resolve(Student.findAll({ where: { program: 'cpa' }})))
        .catch(reject('no results returned'))
    });
}

exports.highGPA = ()=>{
    return new Promise((resolve, reject)=>{
        Student.findAll({
            attributes: ['gpa']
        }).then(function(students){
            let high = 0;
            let highStudent;
            
            for (let i=0; i<students.length; i++)
            {
                if (students[i].gpa > high)
                {
                    high = students[i].gpa;
                    highStudent = students[i];
                }
            }
            resolve(highStudent);
        }).catch(reject('no results returned'))
    }); 
};

exports.allStudents =()=>{
    return new Promise ((resolve,reject) => {
        Student.findAll()
        .then(resolve(Student.findAll()))
        .catch(reject('no results returned'));      
    })
}