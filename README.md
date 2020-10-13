# easy-employee-management

## Description
A node.js command line program that allows for easy mangement of an employee database. The program gives the user the option of creating employees, roles and departments and then viewing, updating and deleting that information.

## Installation
- Clone or download this repository. 
- Use the seed.sql file to configure your mysql database. 
- Adjust the connection paramaters in the `mysql.createConneciton` function at the top of the index.js file to connect to your database.
- Run `npm install` in the working directory using the package.json file provided.
- Run `npm start` to begin

## Usage
Run `npm start` to begin the program once it's installed. You will be met with a menu with a number of options that allow you to make changes to your employee database. It is recommendd that you add departments, then roles and then employees as you will need to departments and roles to assign to employees when they are created.

## Technologies
This program is written in Node.js and uses the mysql and inquirer packages to power the database interface and cli respectively.