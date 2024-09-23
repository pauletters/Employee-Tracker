import inquirer from 'inquirer';
import { pool } from './connection.js';
import {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
} from './functions.js';

async function mainMenu(): Promise<void> {
    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
          ]
        }
      ]);
  
      switch (action) {
        case 'View all departments':
          await viewAllDepartments();
          break;
        case 'View all roles':
          await viewAllRoles();
          break;
        case 'View all employees':
          await viewAllEmployees();
          break;
        case 'Add a department':
          await addDepartment();
          break;
        case 'Add a role':
          await addRole();
          break;
        case 'Add an employee':
          await addEmployee();
          break;
        case 'Update an employee role':
          await updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          await pool.end();
          return;
      }
    }
  }

export async function startCLI() {
  try {
    await mainMenu();
  } catch (error) {
    console.error('An error occurred:', error);
    await pool.end();
  }
}

// This allows the CLI to be run directly if app.ts is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    startCLI();
  }