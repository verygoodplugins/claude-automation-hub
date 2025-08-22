#!/usr/bin/env node

/**
 * Test script for browser profile functionality
 * Demonstrates persistent login sessions
 */

import { BrowserProfileManager } from '../src/browser/profile-manager.js';

async function testBrowserProfiles() {
    console.log('🧪 Testing Browser Profile Management\n');
    
    const profileManager = new BrowserProfileManager();
    
    // Test 1: Create profiles
    console.log('📁 Creating test profiles...');
    const testProfiles = ['test-gmail', 'test-social', 'test-admin'];
    
    for (const profile of testProfiles) {
        const path = profileManager.createProfile(profile);
        console.log(`  ✅ Created: ${profile} -> ${path}`);
    }
    
    console.log('\n📋 Listing all profiles:');
    const profiles = profileManager.listProfiles();
    profiles.forEach(profile => {
        const info = profileManager.getProfileInfo(profile);
        console.log(`  🌐 ${profile} (${info.size})`);
    });
    
    // Test 2: Generate Playwright options
    console.log('\n🎭 Testing Playwright integration:');
    const playwrightOptions = profileManager.getPlaywrightOptions('test-gmail', {
        headless: true,
        slowMo: 100
    });
    
    console.log('  ✅ Playwright options generated:');
    console.log(`     📁 userDataDir: ${playwrightOptions.userDataDir}`);
    console.log(`     🎯 headless: ${playwrightOptions.headless}`);
    console.log(`     ⚡ slowMo: ${playwrightOptions.slowMo}`);
    
    // Test 3: Generate Puppeteer options  
    console.log('\n🎪 Testing Puppeteer integration:');
    const puppeteerOptions = profileManager.getPuppeteerOptions('test-social');
    
    console.log('  ✅ Puppeteer options generated:');
    console.log(`     📁 userDataDir: ${puppeteerOptions.userDataDir}`);
    console.log(`     🎯 headless: ${puppeteerOptions.headless}`);
    
    // Test 4: Profile info
    console.log('\n📊 Profile information:');
    const info = profileManager.getProfileInfo('test-gmail');
    console.log(`  📁 Path: ${info.path}`);
    console.log(`  📊 Size: ${info.size}`);
    console.log(`  🕒 Created: ${info.created.toLocaleString()}`);
    
    // Test 5: Cleanup (optional)
    const cleanup = process.argv.includes('--cleanup');
    if (cleanup) {
        console.log('\n🧹 Cleaning up test profiles...');
        for (const profile of testProfiles) {
            const success = profileManager.deleteProfile(profile);
            console.log(`  ${success ? '✅' : '❌'} Deleted: ${profile}`);
        }
    } else {
        console.log('\n💡 Test profiles created. Run with --cleanup to remove them.');
        console.log('   node test/test-browser-profiles.js --cleanup');
    }
    
    console.log('\n🎉 Browser profile test completed!');
    
    // Usage examples
    console.log('\n💡 Usage examples:');
    console.log('   # Create a profile for Gmail automation');
    console.log('   node tools/browser-profile-manager.js create gmail-work');
    console.log('');
    console.log('   # Use in your automation code:');
    console.log('   const options = profileManager.getPlaywrightOptions("gmail-work");');
    console.log('   const browser = await playwright.chromium.launch(options);');
}

// Run the test
testBrowserProfiles().catch(console.error);
