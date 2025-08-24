#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error.message);
  console.log('Make sure .env file exists and is readable');
  process.exit(1);
}

// Read the template
const templatePath = path.join(__dirname, '..', '.mcp.template.json');
const outputPath = path.join(__dirname, '..', '.mcp.json');

if (!fs.existsSync(templatePath)) {
  console.error('❌ .mcp.template.json not found');
  console.log('Creating template from current .mcp.json...');
  
  // Copy current .mcp.json to template
  const currentConfig = fs.readFileSync(outputPath, 'utf8');
  fs.writeFileSync(templatePath, currentConfig);
  console.log('✅ Created .mcp.template.json');
}

// Read template
let configContent = fs.readFileSync(templatePath, 'utf8');

// Replace all ${VAR_NAME} with actual values
const envVarPattern = /\$\{([^}]+)\}/g;
configContent = configContent.replace(envVarPattern, (match, varName) => {
  // Handle default values like ${NODE_ENV:-development}
  let actualVarName = varName;
  let defaultValue = '';
  
  if (varName.includes(':-')) {
    [actualVarName, defaultValue] = varName.split(':-');
  }
  
  const value = process.env[actualVarName] || defaultValue;
  
  if (!value) {
    console.warn(`⚠️  Warning: Environment variable ${actualVarName} is not set`);
    return match; // Keep the placeholder if no value
  }
  
  return value;
});

// Write the processed config
fs.writeFileSync(outputPath, configContent);

console.log('✅ Generated .mcp.json with environment variables');
console.log('📍 Output:', outputPath);

// Verify critical variables
const criticalVars = [
  'FREESCOUT_URL',
  'FREESCOUT_API_KEY', 
  'SLACK_BOT_TOKEN',
  'GITHUB_PERSONAL_ACCESS_TOKEN',
  'WORDPRESS_USERNAME',
  'WORDPRESS_PASSWORD'
];

const missingVars = criticalVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.log('\n⚠️  Missing critical environment variables:');
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log('\nAdd these to your .env file');
}