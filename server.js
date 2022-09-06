const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'locahost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    }
);

const depts = async () => {
    const deptQuery = `SELECT id AS value, name FROM department;`;
    return await db.promise().query(deptQuery);
};

const roles = async () => {
    const roleQuery = `SELECT id AS value, title AS name FROM role;`;
    return await db.promise().query(roleQuery);
};

const names = async () => {
    const nameQuery = `SLECT id AS value, CONCAT(first_name, " ", last_name) AS nmae FROM employee`
    return await db.promise().query(nameQuery)
}

async function employee() {
    const departments = await depts();
    const roles = await roles();
    const names = await names();

    await inquirer
    .prompt([

        {
            type: 'list',
            name: 'tasks',
            message: 'Select Objective',
            choices: ['View Employees', 'View Roles', 'View Departments', 'Add Employee', 'Update Role', 'Add Role', 'Add Department', 'Quit']
        },
        {
            type: 'input',
        }
    ])
}