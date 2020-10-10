const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const InquirerList = require("./inquirerConst");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_info_db"
})

const query = util.promisify(connection.query).bind(connection);
const connect = util.promisify(connection.connect).bind(connection);
async function init() {
    const answers = await inquirer.prompt([
        new InquirerList("option", "Select an Action", ["View Employees", "View Employees by Department"
            , "View Employees by Manager", "Quit"])
    ])
    connected = await connect()
    console.log("connected as id " + connection.threadId + "\n")
}


async function promptUser(){
    // console.log(connection);
    switch (answers.option) {
        case 'View Employees':
            viewEmployees();
            break;
        case 'View Employees by Department':
            viewEmployeesDepartment();
            break;
        case 'View Employees by Role':
            viewEmployeesRole();
            break;
        case 'View Employees by Manager':
            viewEmployeesManager();
            break;
        case 'Quit':
            connection.end();
            break;
        default:
            console.log("something went very wrong")
            connection.end();
    }

}

async function viewEmployees() {
    const employees = await query("SELECT first_name, last_name, title, salary FROM employees JOIN roles ON employees.role_id = roles.id;");
    console.table(employees);
}

async function viewEmployeesDepartment() {

    const departments = await query("SELECT dept_name FROM departments");

    const answers = await inquirer.prompt([
        new InquirerList("department", "What is the department you would like to see?", departments.map((elm) => elm.dept_name))
    ]);

    const employees = await query("SELECT first_name, last_name, title, salary FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON departments.id = roles.department_id WHERE dept_name = ?;", answers.department);

    console.table(employees)
}

async function viewEmployeesManager() {

    const managers = await query("SELECT b.first_name, b.last_name, b.id FROM employees a JOIN employees b ON a.manager_id = b.id;");

    const answers = await inquirer.prompt([
        new InquirerList("manager", "Whose employees would you like to see?", managers.map((elm) => { return { name: elm.first_name + " " + elm.last_name, value: elm.id } }))
    ]);

    const employees = await query("SELECT a.first_name, a.last_name, a.id FROM employees a JOIN employees b ON a.manager_id = b.id WHERE a.manager_id = ?;", answers.manager);

    console.table(employees)
}

init();

