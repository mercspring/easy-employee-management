DROP DATABASE IF EXISTS employee_info_db;

CREATE DATABASE employee_info_db;

USE employee_info_db;

CREATE TABLE departments(
    id INT AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE roles(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE employees(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY(id)
);


INSERT INTO employees(first_name, last_name, role_id)
VALUES ("Merc","Spring",1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Mari","Spring",3,1);

INSERT INTO employees(first_name, role_id, manager_id)
VALUES ("Tali",2,2);

INSERT INTO roles(title,salary,department_id)
VALUES ("Director of Operations",100000,1);

INSERT INTO roles(title,salary,department_id)
VALUES ("Physio",80000,2);

INSERT INTO roles(title,salary,department_id)
VALUES ("Cat",0,3);

INSERT INTO departments(dept_name)
VALUES ("Leadership");

INSERT INTO departments(dept_name)
VALUES ("Therapy");

INSERT INTO departments(dept_name)
VALUES ("Fun");
