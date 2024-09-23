import inquirer from 'inquirer';
import { pool } from './connection.js';
import { QueryResult } from 'pg';

interface Department {
  id: number;
  name: string;
}

interface Role {
  id: number;
  title: string;
  salary: number;
  department_id: number;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  role_id: number;
  manager_id: number | null;
}

export async function viewAllDepartments(): Promise<void> {
  try {
    const result: QueryResult<Department> = await pool.query('SELECT * FROM department');
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
}

export async function viewAllRoles(): Promise<void> {
  try {
    const result: QueryResult<Role & { department: string }> = await pool.query(`
      SELECT department_role.id, department_role.title, department.name AS department, department_role.salary
      FROM department_role
      JOIN department ON department_role.department_id = department.id
    `);
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
}

export async function viewAllEmployees(): Promise<void> {
  try {
    const result: QueryResult<Employee & { title: string; department: string; salary: number; manager: string | null }> = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, dr.title, d.name AS department, dr.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN department_role dr ON e.role_id = dr.id
      LEFT JOIN department d ON dr.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
}

export async function addDepartment(): Promise<void> {
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:'
    }
  ]);

  try {
    await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
    console.log(`Added department: ${departmentName}`);
  } catch (error) {
    console.error('Error adding department:', error);
  }
}

export async function addRole(): Promise<void> {
  const departments: QueryResult<Department> = await pool.query('SELECT * FROM department');
  
  const { title, salary, departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the new role:'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary for this role:'
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for this role:',
      choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id }))
    }
  ]);

  try {
    await pool.query('INSERT INTO department_role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
    console.log(`Added role: ${title}`);
  } catch (error) {
    console.error('Error adding role:', error);
  }
}

export async function addEmployee(): Promise<void> {
  const roles: QueryResult<Role> = await pool.query('SELECT * FROM department_role');
  const managers: QueryResult<Employee> = await pool.query('SELECT * FROM employee');

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "Enter the employee's first name:"
    },
    {
      type: 'input',
      name: 'lastName',
      message: "Enter the employee's last name:"
    },
    {
      type: 'list',
      name: 'roleId',
      message: "Select the employee's role:",
      choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
    },
    {
      type: 'list',
      name: 'managerId',
      message: "Select the employee's manager:",
      choices: [
        { name: 'None', value: null },
        ...managers.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
      ]
    }
  ]);

  try {
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    console.log(`Added employee: ${firstName} ${lastName}`);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
}

export async function updateEmployeeRole(): Promise<void> {
  const employees: QueryResult<Employee> = await pool.query('SELECT * FROM employee');
  const roles: QueryResult<Role> = await pool.query('SELECT * FROM department_role');

  const { employeeId, newRoleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
    },
    {
      type: 'list',
      name: 'newRoleId',
      message: 'Select the new role:',
      choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
    }
  ]);

  try {
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
    console.log(`Updated employee's role`);
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
}