INSERT INTO department (name)
VALUES ('Engineering'), 
       ('Sales'), 
       ('Finance'), 
       ('Marketing'),
       ('Human Resources'),
       ('Customer Service'),
       ('Quality Assurance'),
       ('Information Technology'),
       ('Accounting'),
       ('Maintenance');
    
INSERT INTO department_role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Sales Manager', 120000, 2),
       ('Financial Analyst', 80000, 3),
       ('Marketing Specialist', 70000, 4),
       ('HR Manager', 90000, 5),
       ('Customer Service Rep', 50000, 6),
       ('QA Tester', 60000, 7),
       ('IT Specialist', 110000, 8),
       ('Accountant', 75000, 9),
       ('Maintenance Worker', 40000, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Alice', 'Johnson', 3, NULL),
       ('Bob', 'Brown', 4, 3),
       ('Charlie', 'White', 5, NULL),
       ('David', 'Black', 6, 5),
       ('Eve', 'Green', 7, NULL),
       ('Frank', 'Blue', 8, 7),
       ('Grace', 'Red', 9, NULL),
       ('Henry', 'Orange', 10, 9);       