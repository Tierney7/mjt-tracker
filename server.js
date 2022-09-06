const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },

);

const deptChoices = async () => {
    const departmentQuery = `SELECT id AS value, name FROM department;`;
    return await db.promise().query(departmentQuery);

};

const roleChoices = async () => {
    const roleQuery = `SELECT id AS value, title AS name FROM role;`;
    return await db.promise().query(roleQuery);
};

const empName = async () => {
    const nameQuery = `SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee`
    return await db.promise().query(nameQuery)
}


async function employee() {

    const departments = await deptChoices();
    const roles = await roleChoices();
    const names = await empName();



    await inquirer
        .prompt([

            {
                type: 'list',
                name: 'tasks',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Update Employee Role', 'Add Role', 'Add Department', 'Quit']
            },
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter first name:',
                when: (answers) => answers.tasks === 'Add Employee'
            },

            {
                type: 'input',
                name: 'last_name',
                message: 'Enter last name:',
                when: (answers) => answers.tasks === 'Add Employee'
            },
            {
                type: 'list',
                name: 'addRoleToEmp',
                message: 'Select employee role:',
                choices: roles[0],
                when: (answers) => answers.tasks === 'Add Employee'
            },
            {
                type: 'input',
                name: 'addRoleTitle',
                message: 'Enter name of role:',
                when: (answers) => answers.tasks === 'Add Role'
            },
            {
                type: 'input',
                name: 'addRoleSalary',
                message: 'Enter Salary for this role:',
                when: (answers) => answers.tasks === 'Add Role'
            },
            {
                type: 'list',
                name: 'addRoleDept',
                message: 'Enter role department:',
                choices: departments[0],
                when: (answers) => answers.tasks === 'Add Role'
            },
            {
                type: 'input',
                name: 'addDept',
                message: 'Enter department name:',
                when: (answers) => answers.tasks === 'Add Department'
            },
            {
                type: 'list',
                name: 'updateEmpName',
                message: 'Enter employee you wish to update:',
                choices: names[0],
                when: (answers) => answers.tasks === 'Update Employee Role'
            },
            {
                type: 'list',
                name: 'updateRole',
                message: 'Enter new employee title:',
                choices: roles[0],
                when: (answers) => answers.tasks === 'Update Employee Role'
            },

        ])

        .then((data) => {


            switch (data.tasks) {

                case 'Add Department':
                    let dept = data.addDept
                    db.query("INSERT INTO department SET ?", {
                        name: dept
                    },
                        function (error) {
                            if (error) throw error;
                        })

                    restartApp()
                    break

                case 'Add Role':
                    let title = data.addRoleTitle
                    let salary = data.addRoleSalary
                    let name = data.addRoleDept

                    db.query("INSERT INTO role SET ?", {
                        title: title,
                        salary: salary,
                        department_id: name
                    },
                        function (error) {
                            if (error) throw error;
                        })

                    restartApp()
                    break

                case 'View All Employees':
                    db.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, manager.first_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id', function (err, result) {
                        console.table(result)
                        console.log(err)
                    })

                    restartApp()
                    break

                case 'Add Employee':
                    let fName = data.first_name;
                    let lName = data.last_name;
                    let empRole = data.addRoleToEmp;
                    db.query("INSERT INTO employee SET ?", {
                        first_name: fName,
                        last_name: lName,
                        role_id: empRole
                    },
                        function (error) {
                            if (error) throw error;
                        })
                    restartApp()
                    break

                case 'View All Roles':
                    db.query('SELECT role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id;',
                        function (err, result) {
                            console.table(result)
                            console.log(err)
                        })

                    restartApp()
                    break

                case 'View All Departments':
                    db.query('SELECT * FROM department;',
                        function (err, result) {
                            console.table(result)
                        })

                    restartApp()
                    break

                case 'Update Employee Role':
                    let newRole = data.updateRole;
                    let newID = data.updateEmpName;
                    let updateEMP = `UPDATE employee SET role_id = ${newRole} WHERE ID = ${newID}`
                    db.query(updateEMP)
                    restartApp()
                    break

                case 'Quit':
                    process.exit();
            }
        })
};

async function restartApp() {
    await new Promise(resolve => setTimeout(resolve, 100));
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'restart',
                message: 'Do you wish to continue?'
            },
        ])
        .then((data) => {
            if (!data.restart) {
                process.exit()
            } else {
                employee()
            }
        })
};




employee()