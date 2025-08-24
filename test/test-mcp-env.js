#!/usr/bin/env node
/**
 * Test script to verify environment variable expansion for MCP servers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Loaded .env file');
} else {
    console.log('⚠️  No .env file found');
}

// Test environment variables that MCP servers need
const requiredVars = [
    'SLACK_BOT_TOKEN',
    'SLACK_USER_TOKEN',
    'GITHUB_PERSONAL_ACCESS_TOKEN',
    'BRAVE_API_KEY',
    'FREESCOUT_URL',
    'FREESCOUT_API_KEY',
    'WORDPRESS_USERNAME',
    'WORDPRESS_PASSWORD',
    'VGP_USERNAME',
    'VGP_PASSWORD',
    'NTFY_TOPIC'
];

console.log('\nEnvironment Variables Status:');
console.log('==============================');

let allPresent = true;
requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        // Show first 10 chars for security
        const preview = value.substring(0, 10) + '...';
        console.log(`✅ ${varName}: ${preview}`);
    } else {
        console.log(`❌ ${varName}: NOT SET`);
        allPresent = false;
    }
});

console.log('\n' + (allPresent ? '✅ All required environment variables are set!' : '⚠️  Some environment variables are missing'));

// Test variable expansion simulation
console.log('\nVariable Expansion Test:');
console.log('========================');
const testExpansion = '${GITHUB_PERSONAL_ACCESS_TOKEN}';
const expanded = testExpansion.replace(/\$\{([^}]+)\}/g, (match, varName) => {
    return process.env[varName] || match;
});
console.log(`Original: ${testExpansion}`);
console.log(`Expanded: ${expanded.substring(0, 20)}...`);

console.log('\n📝 Note: Claude Desktop will expand ${VAR} syntax from your system environment.');
console.log('📝 Note: Cursor will read from .env file thanks to .cursorignore with !.env');