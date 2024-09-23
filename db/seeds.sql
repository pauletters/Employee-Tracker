INSERT INTO department (name)
VALUES ('Engineering'), 
       ('Sales'), 
       ('Finance'), 
       ('Marketing'),
       ('Human Resources'),
       ('Administration'),
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
       ('Office Manager', 120000, 6),
       ('Customer Service Rep', 50000, 7),
       ('QA Tester', 60000, 8),
       ('IT Specialist', 110000, 9),
       ('Accountant', 75000, 10),
       ('Maintenance Worker', 40000, 11);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 9),
       ('Jane', 'Smith', 2, 6),
       ('Alice', 'Johnson', 3, 10),
       ('Bob', 'Brown', 4, 6),
       ('Charlie', 'White', 5, NULL),
        ('Nancy', 'Grey', 6, NULL),
       ('David', 'Black', 7, 6),
       ('Eve', 'Green', 8, 9),
       ('Frank', 'Blue', 9, 6),
       ('Grace', 'Red', 10, 6),
       ('Henry', 'Orange', 11, 6);       