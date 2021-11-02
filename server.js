const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
)

init()

const findDepartments = () => {
    return new Promise((fulfill, reject) => {
        const departmentArray = []
        db.query('SELECT * FROM department', (error, results) => {
            if (error) reject(error);
            for (let i = 0; i < results.length; i++) {
                departmentArray.push(results[i].name)
            }
            fulfill(departmentArray)
        })
    })
}

const findRoles = () => {
    return new Promise((fulfill, reject) => {
        const roleArray = []
        db.query('SELECT * FROM role', (error, results) => {
            if (error) reject(error);
            for (let i = 0; i < results.length; i++) {
                roleArray.push(results[i].title)
            }
            fulfill(roleArray)
        })
    })
}

const findEmployees = () => {
    return new Promise((fulfill, reject) => {
        const employeeArray = []
        db.query('SELECT * FROM employee', (error, results) => {
            if (error) reject(error);
            for (let i = 0; i < results.length; i++) {
                employeeArray.push(results[i].first_name + ' ' + results[i].last_name)
            }
            fulfill(employeeArray)
        })
    })
}

const findManagers = () => {
    return new Promise((fulfill, reject) => {
        const managerArray = []
        db.query('SELECT * FROM employee WHERE role_id = 1', (error, results) => {
            if (error) reject(error);
            for (let i = 0; i < results.length; i++) {
                managerArray.push(results[i].first_name + ' ' + results[i].last_name)
            }
            fulfill(managerArray)
        })
    })
}

const findDeptId = (Dimiter) => {
    return new Promise((fulfill, reject) => {
        db.query('SELECT id FROM department WHERE name = ?', Dimiter, (error, results) => {
            if (error) reject(error);
            fulfill(results[0].id)
        })
    })
}

const findRoleId = (Dimiter) => {
    return new Promise((fulfill, reject) => {
        db.query('SELECT id FROM role WHERE title = ?', Dimiter, (error, results) => {
            if (error) reject(error);
            fulfill(results[0].id)
        })
    })
}

const findEmployeeId = (Dimiter) => {
    return new Promise((fulfill, reject) => {
        db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [Dimiter.split(" ")[0], Dimiter.split(" ")[1]], (error, results) => {
            if (error) reject(error);
            fulfill(results[0].id)
        })
    })
}

const findRolesByDepartment = (department) => {
    return new Promise((fulfill, reject) => {
        const roleArray = []
        db.query(`SELECT * FROM role WHERE department_id = ?`, department, (error, results) => {
            if (error) reject(error);
            for (let i = 0; i < results.length; i++) {
                roleArray.push(results[i].title)
            }
            fulfill(roleArray)
        })
    })
}

const findRoleSalary = (role) => {
    return new Promise((fulfill, reject) => {
        db.query(`SELECT * FROM role WHERE id = ?`, role, (error, results) => {
            if (error) reject(error);
            fulfill(results[0].salary)
        })
    })
}

const findEmployeesPerRole = (role) => {
    return new Promise((fulfill, reject) => {
        db.query('SELECT * FROM employee WHERE role_id = ?', role, (error, results) => {
            if (error) reject(error);
            fulfill(results.length)
        })
    })
}

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Quit']
        }
    ])
        .then(data => {
            switch (data.init) {
                case 'View All Departments':
                    db.query('SELECT name AS Department FROM department', (error, results) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.table(results)
                            cont()
                        }
                    })
                    break;
                case 'View All Roles':
                    db.query('SELECT title AS Role, salary AS Salary, department.name AS Department FROM role JOIN department ON department_id = department.id', (error, results) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.table(results)
                            cont()
                        }
                    })
                    break;
                case 'View All Employees':

                    db.query(`SELECT CONCAT(a.first_name, " ", a.last_name) AS Name, role.title AS Role, IFNULL(CONCAT(b.first_name, " ", b.last_name),"[None]") AS Manager
                FROM employee a
                LEFT JOIN employee b ON b.id = a.manager_id
                JOIN role ON a.role_id = role.id
                ORDER BY a.last_name`, (error, results) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.table(results)
                            cont()
                        }
                    })
                    break;
                case 'Add a Department':
                    addDepartment()
                    break;
                case 'Add a Role':
                    addRole()
                    break;
                case 'Add an Employee':
                    addEmployee()
                    break;
                case 'Quit':
                    console.log('Goodbye!');
                    break;
            }
        })
}



function cont() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'cont',
            message: 'Would you like to continue?',
            choices: ['[Continue]', '[Quit]']
        }
    ])
        .then(data => {
            switch (data.cont) {
                case '[Continue]':
                    init()
                    break;
                case '[Quit]':
                    console.log("Goodbye!");
                    break;
            }
        })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'What would you like to call this department?'
        }
    ])
        .then(data => {
            db.query('INSERT INTO department (name) VALUES (?)', data.deptName, (error, results) => {
                if (error) throw error;
                console.warn('Department added!')
                db.query('SELECT name AS Department FROM department', (error, results) => {
                    if (error) throw error;
                    console.table(results)
                    cont()
                }
                )
            })
        })
}


async function addRole() {

    const departmentList = await findDepartments();

    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What would you like to name this role?'
        },
        {
            type: 'number',
            name: 'roleSalary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'roleDept',
            message: 'What department does this role belong to?',
            choices: departmentList
        }
    ])
        .then(async (data) => {

            const deptNum = await findDeptId(data.roleDept);

            db.query('INSERT INTO role (title,salary,department_id) VALUES (?,?,?)', [data.roleName, data.roleSalary, deptNum], (error, results) => {
                if (error) throw error;
                console.warn('Role added!')
                db.query('SELECT title AS Role, salary AS Salary, department.name AS Department FROM role JOIN department ON department_id = department.id', (error, results) => {
                    if (error) throw error;
                    console.table(results)
                    cont()
                }
                )
            })

        })
}

async function addEmployee() {

    const roleList = await findRoles();
    const managerList = await findManagers();

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter first name'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter last name'
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: "What is this employee's role?",
            choices: roleList
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: "Who is this employee's manager?",
            choices: managerList
        }
    ])
        .then(async (data) => {

            const roleNum = await findRoleId(data.employeeRole);
            const managerNum = await findEmployeeId(data.employeeManager)

            db.query('INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', [data.firstName.trim(), data.lastName.trim(), roleNum, managerNum], (error, results) => {
                if (error) throw error;
                console.warn('Employee added!')
                db.query(`SELECT CONCAT(a.first_name, " ", a.last_name) AS Name, role.title AS Role, IFNULL(CONCAT(b.first_name, " ", b.last_name),"[None]") AS Manager
            FROM employee a
            LEFT JOIN employee b ON b.id = a.manager_id
            JOIN role ON a.role_id = role.id
            ORDER BY a.last_name`, (error, results) => {
                    if (error) throw error;
                    console.table(results)
                    cont()
                }
                )
            })
        })
}