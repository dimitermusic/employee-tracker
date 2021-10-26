const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require("express");
const app = express()
const PORT = process.env.PORT || 3001


const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'genova66',
        database: 'employee_db',
    },
    console.log(`Connected to the employee_db database.`)
);

const main = () => {
    inquirer
        .prompt({
            type: 'list',
            message: 'What do you want to do?',
            name: 'choice',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
        })
        .then((data) => {
            if (data.choice === 'view all departments') {
                db.query('SELECT * FROM department', (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(data);
                        main()
                    }
                });
            } else if (data.choice === 'view all roles') {
                db.query('SELECT * FROM role', (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(data);
                        main()
                    }
                });
            } else if (data.choice === 'view all employees') {
                db.query('SELECT * FROM employee', (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(data);
                        main();
                    }
                });
            } else if (data.choice === 'add a department') {
                inquirer
                    .prompt(
                        {
                            type: 'input',
                            message: "What is the new department's name?",
                            name: 'depName'
                        }
                    )
                    .then((ans) => {
                        db.query("INSERT INTO department(name)VALUES(?)", [ans.depName], (err, data) => {
                            if (err) {
                                throw err
                            } else {
                                console.log(data);
                                main();
                            }
                        });
                    })
            } else if (data.choice === 'add a role') {
                inquirer
                    .prompt(
                        {
                            type: 'input',
                            message: "What is the new role's name?",
                            name: 'roleName'
                        }
                    )
                    .then((ans) => {
                        db.query("INSERT INTO role(name)VALUES(?)", [ans.roleName], (err, data) => {
                            if (err) {
                                throw err
                            } else {
                                console.log(data);
                                main();
                            }
                        });
                    })
            } else if (data.choice === 'add an employee') {
                inquirer
                .prompt(
                    {
                        type: 'input',
                        message: "What is the new employee's name?",
                        name: 'employeeName'
                    }
                )
                .then((ans) => {
                    db.query("INSERT INTO employee(name)VALUES(?)", [ans.employeeName], (err, data) => {
                        if (err) {
                            throw err
                        } else {
                            console.log(data);
                            main();
                        }
                    });
                })
            }
            else if (data.choice === 'update an employee role') {
                inquirer
                .prompt(
                    {
                        type: 'input',
                        message: "What is the id of the employee you are updating?",
                        name: 'updateEmpId'
                    },
                    {
                        type: 'input',
                        message: "What is the id of the updated role you would like to assign to the employee?",
                        name: 'updateRoleId'
                    }
                )
                .then((ans) => {
                    db.query("UPDATE employee SET employee(role_id)=? WHERE employee(id)=?VALUES(?,?)", [updateRoleId, ans.updateEmpId], (err, data) => {
                        if (err) {
                            throw err
                        } else {
                            console.log(data);
                            main();
                        }
                    });
                })
            }
            else {
                console.log("goodbye")
                db.end();
            }
        });
}

main();