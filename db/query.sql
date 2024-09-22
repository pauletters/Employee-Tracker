SELECT *
FROM department_role
JOIN department ON department_role.department_id = department.id;

SELECT *
FROM employee
JOIN department_role ON employee.role_id = department_role.id