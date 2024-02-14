#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import inquirer from 'inquirer';

async function main() {
  checkNodeVersion();
  checkVSCodeCLI();

  let projectName = await getProjectName();

  console.log(`Using project name: ${projectName}`);

  // Cloning, initializing git, installing dependencies, and opening VS Code
  try {
    console.log("Cloning the project template...");
    execSync(`git clone --depth 1 https://github.com/jonathan-oralart/typescript-debug-vscode.git "${projectName}" --quiet`);

    console.log("Removing the existing .git directory...");
    execSync(`rm -rf "${join(projectName, '.git')}"`);

    console.log("Initializing a new git repository...");
    execSync('git init', { cwd: projectName });

    console.log("Checking pnpm...");
    try {
      execSync('pnpm --version', { stdio: 'ignore' });
    } catch (error) {
      console.log("Installing pnpm...");
      execSync('npm install -g pnpm');
    }

    console.log("Installing dependencies...");
    execSync('pnpm install', { cwd: projectName });

    console.log("Opening project in Visual Studio Code...");
    execSync(`code .`, { cwd: projectName });

    console.log("Project setup is complete.");
  } catch (error) {
    console.error(`Error during project setup: ${error.message}`);
  }
}

main();



// Function to check Node version compatibility
function checkNodeVersion() {
  const version = process.versions.node;
  const majorVersion = parseInt(version.split('.')[0], 10);

  if (majorVersion < 21) {
    console.log("Your Node version is less than the required version 21.");
    console.log("Please update your Node.js to version 21 or higher.");
    process.exit(1);
  }
}


// Check if VS Code command line tool is installed
function checkVSCodeCLI() {
  try {
    execSync('code --version', { stdio: 'ignore' });
  } catch (error) {
    console.log("VS Code (code command) is not installed. Please install it to open projects directly.");
    process.exit(1);
  }
}

async function getProjectName() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'destination',
      message: 'Select installation destination:',
      choices: ['Current Repository', '~/typescript_test']
    }
  ]);

  let projectName = '';
  let baseFolder = ''; // Define baseFolder here for scope access
  if (answers.destination === 'Current Repository') {
    baseFolder = '.';
    projectName = generateProjectName(baseFolder);
  } else { // '~/typescript_test'
    baseFolder = join(process.env.HOME, 'typescript_test');
    if (!existsSync(baseFolder)) {
      mkdirSync(baseFolder, { recursive: true });
    }
    projectName = generateProjectName(baseFolder);
  }
  return projectName;
}

// Adjust generateProjectName to accept baseFolder
function generateProjectName(baseFolder) {
  const baseName = `test`;
  let counter = 1;
  let fullPath = join(baseFolder, `${baseName}_${counter}`);

  while (existsSync(fullPath)) {
    counter += 1;
    fullPath = join(baseFolder, `${baseName}_${counter}`);
  }

  return fullPath; // Return the full path to ensure uniqueness across different directories
}