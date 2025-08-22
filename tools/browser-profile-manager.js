#!/usr/bin/env node

/**
 * Browser Profile Manager CLI Tool
 * Command-line interface for managing browser profiles
 */

import { BrowserProfileManager } from '../src/browser/profile-manager.js';
import readline from 'readline';

class BrowserProfileCLI {
    constructor() {
        this.profileManager = new BrowserProfileManager();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Display help information
     */
    showHelp() {
        console.log(`
🌐 Browser Profile Manager - Claude Automation Hub

Usage: node tools/browser-profile-manager.js [command] [options]

Commands:
  list                    List all browser profiles
  create <name>          Create a new browser profile
  delete <name>          Delete a browser profile
  info <name>            Show profile information
  interactive            Interactive profile management
  help                   Show this help message

Examples:
  node tools/browser-profile-manager.js list
  node tools/browser-profile-manager.js create gmail-work
  node tools/browser-profile-manager.js info gmail-work
  node tools/browser-profile-manager.js delete old-profile

Profile Usage in Code:
  const { BrowserProfileManager } = require('./src/browser/profile-manager');
  const profileManager = new BrowserProfileManager();
  
  // For Playwright
  const options = profileManager.getPlaywrightOptions('gmail-work');
  const browser = await playwright.chromium.launch(options);
  
  // For Puppeteer
  const options = profileManager.getPuppeteerOptions('gmail-work');
  const browser = await puppeteer.launch(options);
`);
    }

    /**
     * List all profiles
     */
    listProfiles() {
        const profiles = this.profileManager.listProfiles();
        
        if (profiles.length === 0) {
            console.log('📭 No browser profiles found.');
            console.log('💡 Create one with: node tools/browser-profile-manager.js create <name>');
            return;
        }
        
        console.log(`\n📁 Found ${profiles.length} browser profile(s):\n`);
        
        profiles.forEach(profile => {
            const info = this.profileManager.getProfileInfo(profile);
            console.log(`  🌐 ${profile}`);
            console.log(`     📍 ${info.path}`);
            console.log(`     📊 ${info.size}`);
            console.log(`     🕒 Modified: ${info.modified.toLocaleString()}`);
            console.log('');
        });
    }

    /**
     * Create a new profile
     */
    createProfile(name) {
        if (!name) {
            console.log('❌ Profile name is required');
            console.log('Usage: node tools/browser-profile-manager.js create <name>');
            return;
        }
        
        const profilePath = this.profileManager.createProfile(name);
        console.log(`📁 Profile path: ${profilePath}`);
        console.log(`\n💡 Usage example:`);
        console.log(`const options = profileManager.getPlaywrightOptions('${name}');`);
    }

    /**
     * Delete a profile
     */
    async deleteProfile(name) {
        if (!name) {
            console.log('❌ Profile name is required');
            console.log('Usage: node tools/browser-profile-manager.js delete <name>');
            return;
        }
        
        const info = this.profileManager.getProfileInfo(name);
        if (!info) {
            console.log(`❌ Profile '${name}' not found`);
            return;
        }
        
        console.log(`\n⚠️  About to delete profile: ${name}`);
        console.log(`📁 Path: ${info.path}`);
        console.log(`📊 Size: ${info.size}`);
        
        const answer = await this.askQuestion('\n❓ Are you sure? (y/N): ');
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            const success = this.profileManager.deleteProfile(name);
            if (success) {
                console.log('✅ Profile deleted successfully');
            } else {
                console.log('❌ Failed to delete profile');
            }
        } else {
            console.log('🚫 Deletion cancelled');
        }
    }

    /**
     * Show profile information
     */
    showProfileInfo(name) {
        if (!name) {
            console.log('❌ Profile name is required');
            console.log('Usage: node tools/browser-profile-manager.js info <name>');
            return;
        }
        
        const info = this.profileManager.getProfileInfo(name);
        if (!info) {
            console.log(`❌ Profile '${name}' not found`);
            return;
        }
        
        console.log(`\n🌐 Profile: ${info.name}`);
        console.log(`📁 Path: ${info.path}`);
        console.log(`📊 Size: ${info.size}`);
        console.log(`🕒 Created: ${info.created.toLocaleString()}`);
        console.log(`🕒 Modified: ${info.modified.toLocaleString()}`);
        
        console.log(`\n💡 Usage examples:`);
        console.log(`// Playwright`);
        console.log(`const options = profileManager.getPlaywrightOptions('${name}');`);
        console.log(`const browser = await playwright.chromium.launch(options);`);
        console.log(`\n// Puppeteer`);
        console.log(`const options = profileManager.getPuppeteerOptions('${name}');`);
        console.log(`const browser = await puppeteer.launch(options);`);
    }

    /**
     * Interactive mode
     */
    async interactive() {
        console.log('🌐 Browser Profile Manager - Interactive Mode');
        console.log('Type "help" for commands or "exit" to quit\n');
        
        while (true) {
            const input = await this.askQuestion('profile-manager> ');
            const [command, ...args] = input.trim().split(' ');
            
            switch (command.toLowerCase()) {
                case 'list':
                case 'ls':
                    this.listProfiles();
                    break;
                    
                case 'create':
                    this.createProfile(args[0]);
                    break;
                    
                case 'delete':
                case 'rm':
                    await this.deleteProfile(args[0]);
                    break;
                    
                case 'info':
                    this.showProfileInfo(args[0]);
                    break;
                    
                case 'help':
                    console.log(`
Available commands:
  list, ls              List all profiles
  create <name>         Create a new profile
  delete <name>, rm     Delete a profile
  info <name>           Show profile information
  help                  Show this help
  exit, quit            Exit interactive mode
`);
                    break;
                    
                case 'exit':
                case 'quit':
                    console.log('👋 Goodbye!');
                    this.rl.close();
                    return;
                    
                case '':
                    break;
                    
                default:
                    console.log(`❌ Unknown command: ${command}`);
                    console.log('Type "help" for available commands');
            }
        }
    }

    /**
     * Ask a question and return the answer
     */
    askQuestion(question) {
        return new Promise(resolve => {
            this.rl.question(question, resolve);
        });
    }

    /**
     * Run the CLI
     */
    async run() {
        const args = process.argv.slice(2);
        const command = args[0];
        
        switch (command) {
            case 'list':
                this.listProfiles();
                break;
                
            case 'create':
                this.createProfile(args[1]);
                break;
                
            case 'delete':
                await this.deleteProfile(args[1]);
                break;
                
            case 'info':
                this.showProfileInfo(args[1]);
                break;
                
            case 'interactive':
                await this.interactive();
                return; // Don't close rl here
                
            case 'help':
            case undefined:
                this.showHelp();
                break;
                
            default:
                console.log(`❌ Unknown command: ${command}`);
                this.showHelp();
        }
        
        this.rl.close();
    }
}

// Run the CLI if this file is executed directly
const cli = new BrowserProfileCLI();
cli.run().catch(console.error);

export { BrowserProfileCLI };
