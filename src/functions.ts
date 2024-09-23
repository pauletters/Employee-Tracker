import inquirer from 'inquirer';
import { pool } from './connection.js';
import { QueryResult } from 'pg';
import Table from 'cli-table3';

// The Department, Role, and Employee interfaces are used to define the structure of the data returned from the database.
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

// The displayTable function utilizes the cli-table3 package to display the data in a table format that is visually appealing.
function displayTable(data: any[]): void {
    if (data.length === 0) {
      console.log('No data to display');
      return;
    }
    // These are the headers for the table. The Object.keys method is used to extract the keys from the first object in the data array.  
    const headers = Object.keys(data[0]);
    // The Table class from the cli-table3 package is used to create a new table with the headers and style options.
    const table = new Table({
      head: headers,
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });
//   This loop iterates over each row in the data array and extracts the values from each object. 
//   The values are then converted to strings and pushed into the table array.
    data.forEach(row => {
      const values = Object.values(row).map(value => (value ?? 'NULL').toString());
        table.push(values);
    });
  
    console.log(table.toString());
  }

// The viewAllDepartments function queries the database for all departments and then calls the displayTable function to display the results.
export async function viewAllDepartments(): Promise<void> {
  try {
    const result: QueryResult<Department> = await pool.query('SELECT * FROM department');
    displayTable(result.rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
}

// The viewAllRoles function queries the database for all roles and then calls the displayTable function to display the results.
export async function viewAllRoles(): Promise<void> {
  try {
    const result: QueryResult<Role & { department: string }> = await pool.query(`
      SELECT department_role.id, department_role.title, department.name AS department, department_role.salary
      FROM department_role
      JOIN department ON department_role.department_id = department.id
    `);
    displayTable(result.rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
}

// The viewAllEmployees function queries the database for all employees and then calls the displayTable function to display the results.
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
    displayTable(result.rows);
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
}

// The addDepartment function prompts the user for the name of the new department and then inserts it into the database.
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

// The addRole function prompts the user for the title, salary, and department of the new role and then inserts it into the database.
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

// The addEmployee function prompts the user for the first name, last name, role, and manager of the new employee and then inserts it into the database.
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

// The updateEmployeeRole function prompts the user to select an employee and a new role, then updates the employee's role in the database.
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