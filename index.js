#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Correctly reference the path to index.sh
const scriptPath = path.join(__dirname, 'index.sh');

const shellScript = spawn('sh', [scriptPath], { stdio: 'inherit' });

shellScript.on('close', (code) => {
  process.exit(code);
});