import inquirer from 'inquirer';
import { getAllDepartments, closePool } from './db.js';

async function viewDepartmentTable() {
  try {
    console.log('Fetching all departments...');
    
    const departments = await getAllDepartments();

    console.log('All departments:');
    console.table(departments);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all departments','Exit']
      }
    ]);

    if (action === 'View all departments') {
      await getAllDepartments();
    } else {
      await closePool();
    }
  } catch (error) {
    console.error('An error occurred:', error);
    await closePool();
  }
}

viewDepartmentTable();

export { viewDepartmentTable };