const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const { InquirerList, InquirerInput } = require("./lib/inquirerConst");
const cTable = require('console.table');
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

    connected = await connect()
    console.log("connected as id " + connection.threadId + "\n")

    promptUser();
}


async function promptUser() {
    // console.log(connection);
    const answers = await inquirer.prompt([
        new InquirerList("option", "Select an Action", ["View Employees", "View Employees by Department"
            , "View Employees by Manager", "View Roles", "View Departments", "View Department Operating Cost", "Add Employee", "Add Department", "Add Role",
            "Update Employee Role", "Update Employee Manager", "Update Role Department", "Update Role Salary",
            "Remove Employee", "Remove Role", "Remove Department", "Quit"])
    ])
    switch (answers.option) {
        case 'View Employees':
            await viewEmployees();
            await promptUser();
            break;
        case 'View Employees by Department':
            await viewEmployeesDepartment();
            await promptUser();
            break;
        case 'View Employees by Role':
            await viewEmployeesRole();
            await promptUser();
            break;
        case 'View Employees by Manager':
            await viewEmployeesManager();
            await promptUser();
            break;
        case 'View Department Operating Cost':
            await viewDepartmentBudget();
            await promptUser();
            break;
        case 'Add Employee':
            await addEmployee();
            await promptUser();
            break;
        case 'Add Department':
            await addDepartment();
            await promptUser();
            break;
        case 'Add Role':
            await addRole();
            await promptUser();
            break;
        case 'Remove Employee':
            await removeEmployee();
            await promptUser();
            break;
        case 'View Roles':
            await viewRoles();
            await promptUser();
            break;
        case 'Remove Role':
            await removeRole();
            await promptUser();
            break;
        case 'Remove Department':
            await removeDepartment();
            await promptUser();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            await promptUser();
            break;
        case 'Update Employee Manager':
            await updateEmployeeManager();
            await promptUser();
            break;
        case 'View Departments':
            await viewDepartments();
            await promptUser();
            break;
        case 'Update Role Department':
            await updateRoleDepartment();
            await promptUser();
            break;
        case 'Update Role Salary':
            await updateRoleSalary();
            await promptUser();
            break;
        case 'Quit':
            connection.end();
            break;
        default:
            console.log("something went very wrong")
            connection.end();
    }

}

async function removeRole() {
    let roles = await query("SELECT title, salary, dept_name, roles.id FROM roles JOIN departments ON departments.id = roles.department_id;");
    roles = roles.map(elm => { return { name: elm.title + " | " + elm.dept_name, value: elm.id } });
    const answers = await inquirer.prompt([
        new InquirerList("id", "Which role would you like to remove?", roles)
    ])

    await query("DELETE FROM roles WHERE ? ", answers)
}
async function updateEmployeeRole() {
    let employees = await query("SELECT first_name, last_name, employees.id, title FROM employees LEFT JOIN roles ON employees.role_id = roles.id")
    employees = employees.map(elm => { return { name: elm.first_name + " " + elm.last_name, value: elm.id } });
    let roles = await query("SELECT title, id FROM roles");
    roles = roles.map(elm => { return { name: elm.title, value: elm.id } });
    const answers = await inquirer.prompt([
        new InquirerList("employee_id", "Which employee is changing roles?", employees),
        new InquirerList("role_id", "Which role are they taking on?", roles)
    ])
    await query("UPDATE employees SET role_id = ? WHERE id = ?", [answers.role_id, answers.employee_id]);
}
async function viewDepartments() {
    const departments = await query("SELECT dept_name FROM departments");
    console.table(departments);
}

async function addRole() {
    let departments = await query("SELECT dept_name, id FROM departments");
    departments = departments.map((elm) => { return { name: elm.dept_name, value: elm.id } });

    const answers = await inquirer.prompt([
        new InquirerInput("title", "What is the name of the role you are adding?"),
        new InquirerInput("salary", "How much does this role pay?"),
        new InquirerList("department_id", "What department is this role in?", departments)
    ])

    answers.salary = parseFloat(answers.salary)
    if (!answers.salary) {
        return console.log("Please provide a number for the salary.")
    }

    await query("INSERT INTO roles SET ?", answers);
}
async function addDepartment() {
    const answers = await inquirer.prompt([
        new InquirerInput("dept_name", "What is the name of the Department you would like to add?")
    ])
    await query("INSERT INTO departments SET ?", answers);
}
async function viewRoles() {
    let roles = await query("SELECT title, salary, dept_name as department FROM roles JOIN departments ON departments.id = roles.department_id;");
    console.table(roles)
}
async function removeEmployee() {

    let employees = await query("SELECT first_name, last_name, id FROM employees;");
    employees = employees.map((elm) => { return { name: elm.first_name + " " + elm.last_name, value: elm.id } });
    const answers = await inquirer.prompt([
        new InquirerList("id", "Who would you like to remove?", employees)
    ])
    await query("DELETE FROM employees WHERE ? ", answers)
}
async function addEmployee() {

    let employees = await query("SELECT first_name, last_name, id FROM employees;");
    employees = [...employees.map((elm) => { return { name: elm.first_name + " " + elm.last_name, value: elm.id } }), { name: "n/a", value: null }];

    let roles = await query("SELECT title, id FROM roles;");
    roles = roles.map((elm) => { return { name: elm.title, value: elm.id } })

    const answers = await inquirer.prompt([
        new InquirerInput("first_name", "What is their first name?"),
        new InquirerInput("last_name", " What is their last name?"),
        new InquirerList("manager_id", "Who is their manager?", employees),
        new InquirerList("role_id", "What is their role?", roles)
    ])
    if (answers.manager_id != null) {
        await query("INSERT INTO employees SET ?", answers)
    } else {
        delete answers.manager_id;
        await query("INSERT INTO employees SET ?", answers)
    }
}

async function viewEmployees() {
    let employees = await query("SELECT concat(employees.first_name,' ', employees.last_name) as Employee, title as Title, salary as Salary, dept_name as Department, concat(managers.first_name,' ',managers.last_name) as Manager FROM employees left join employees as managers on employees.manager_id = managers.id LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON departments.id = roles.department_id");
    employees.map(addDashes)

    console.table(employees);
    console.log("\n")
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

    const managers = await query("SELECT b.first_name, b.last_name, b.id FROM employees a JOIN employees b ON a.manager_id = b.id GROUP BY b.id;");
    const answers = await inquirer.prompt([
        new InquirerList("manager", "Whose employees would you like to see?", managers.map((elm) => { return { name: elm.first_name + " " + elm.last_name, value: elm.id } }))
    ]);

    let employees = await query("SELECT a.first_name, a.last_name, title FROM employees a LEFT JOIN employees b ON a.manager_id = b.id LEFT JOIN roles ON a.role_id = roles.id WHERE a.manager_id = ?;", answers.manager);
    const employees2 = employees.map(addDashes);
    console.table(employees);
}

function addDashes(obj) {
    for (key in obj) {

        if (obj[key] === null) {
            obj[key] = "-";
        }
    }
    return obj
}

async function removeDepartment() {
    let departments = await query("SELECT dept_name, id FROM departments;");
    departments = departments.map(elm => { return { name: elm.dept_name, value: elm.id } });
    const answers = await inquirer.prompt([
        new InquirerList("id", "Which department would you like to remove?", departments)
    ])
    await query("DELETE FROM departments WHERE ? ", answers);
}

async function updateEmployeeManager() {
    let employees = await query("SELECT first_name, last_name, title, employees.id FROM employees LEFT JOIN roles ON employees.role_id = roles.id;");
    employees.map(addDashes)
    employees = employees.map((elm) => { return { name: elm.first_name + " " + elm.last_name + " | " + elm.title, value: elm.id } });

    const answers = await inquirer.prompt([
        new InquirerList("employee_id", "Who is getting a new manager?", employees),
        new InquirerList("manager_id", "Who is their new manager?", employees)
    ])

    if (answers.employee_id === answers.manager_id) {
        return console.log("Employee can't be their own manger.")
    } else {
        query("UPDATE employees SET manager_id = ? WHERE id = ?", [answers.manager_id, answers.employee_id]);
        console.table("Updated manger");
    }
}

async function updateRoleDepartment() {
    let roles = await query("SELECT title, salary, id FROM roles");
    roles = roles.map((elm) => { return { name: elm.title + " " + elm.salary, value: elm.id } });

    let departments = await query("SELECT dept_name, id FROM departments");
    departments = departments.map((elm) => { return { name: elm.dept_name, value: elm.id } });

    const answers = await inquirer.prompt([
        new InquirerList("role_id", "Which role would you like to move to a new department", roles),
        new InquirerList("department_id", "What department would you like to move this role to?", departments)
    ])
    await query("UPDATE roles SET department_id = ? WHERE id = ?", [answers.department_id, answers.role_id]);
}
async function updateRoleSalary() {
    let roles = await query("SELECT title, salary, id FROM roles");
    roles = roles.map((elm) => { return { name: elm.title + " " + elm.salary, value: elm.id } });

    let answers = await inquirer.prompt([
        new InquirerList("id", "Which role would you like to give a new salary?", roles),
        new InquirerInput("salary", "What salary would you like to give this role?")
    ])
    answers.salary = parseFloat(answers.salary)
    if (!answers.salary) {
        return console.log("Please provide a number for the salary.")
    }
    await query("UPDATE roles SET salary = ? WHERE id = ?", [answers.salary, answers.id]);
    console.log("Updated Salary")
}
async function viewDepartmentBudget() {
    const departments = await query("SELECT dept_name as Department, SUM(salary) as 'Operating Cost' FROM  departments JOIN roles ON departments.id = roles.department_id JOIN employees on employees.role_id = roles.id GROUP BY dept_name;")
    console.table(departments)
}
init();

