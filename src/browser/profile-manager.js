/**
 * Browser Profile Manager for Claude Automation Hub
 * Manages persistent browser profiles to maintain login sessions
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

class BrowserProfileManager {
    constructor() {
        this.profilesDir = path.join(os.homedir(), '.claude-automation-hub', 'browser-profiles');
        this.ensureProfilesDirectory();
    }

    /**
     * Ensure the profiles directory exists
     */
    ensureProfilesDirectory() {
        if (!fs.existsSync(this.profilesDir)) {
            fs.mkdirSync(this.profilesDir, { recursive: true });
        }
    }

    /**
     * Get the path for a specific profile
     * @param {string} profileName - Name of the profile
     * @returns {string} - Full path to the profile directory
     */
    getProfilePath(profileName) {
        const safeName = profileName.replace(/[^a-zA-Z0-9-_]/g, '_');
        return path.join(this.profilesDir, safeName);
    }

    /**
     * Create or get an existing profile
     * @param {string} profileName - Name of the profile
     * @returns {string} - Path to the profile directory
     */
    createProfile(profileName) {
        const profilePath = this.getProfilePath(profileName);
        
        if (!fs.existsSync(profilePath)) {
            fs.mkdirSync(profilePath, { recursive: true });
            console.log(`✅ Created new browser profile: ${profileName}`);
        } else {
            console.log(`🔄 Using existing browser profile: ${profileName}`);
        }
        
        return profilePath;
    }

    /**
     * List all available profiles
     * @returns {Array<string>} - Array of profile names
     */
    listProfiles() {
        if (!fs.existsSync(this.profilesDir)) {
            return [];
        }
        
        return fs.readdirSync(this.profilesDir)
            .filter(item => fs.statSync(path.join(this.profilesDir, item)).isDirectory());
    }

    /**
     * Delete a profile
     * @param {string} profileName - Name of the profile to delete
     * @returns {boolean} - Success status
     */
    deleteProfile(profileName) {
        const profilePath = this.getProfilePath(profileName);
        
        if (fs.existsSync(profilePath)) {
            fs.rmSync(profilePath, { recursive: true, force: true });
            console.log(`🗑️  Deleted browser profile: ${profileName}`);
            return true;
        }
        
        return false;
    }

    /**
     * Get profile info including size and last modified
     * @param {string} profileName - Name of the profile
     * @returns {Object} - Profile information
     */
    getProfileInfo(profileName) {
        const profilePath = this.getProfilePath(profileName);
        
        if (!fs.existsSync(profilePath)) {
            return null;
        }
        
        const stats = fs.statSync(profilePath);
        const size = this.getDirectorySize(profilePath);
        
        return {
            name: profileName,
            path: profilePath,
            created: stats.birthtime,
            modified: stats.mtime,
            size: this.formatBytes(size)
        };
    }

    /**
     * Get the size of a directory recursively
     * @param {string} dirPath - Directory path
     * @returns {number} - Size in bytes
     */
    getDirectorySize(dirPath) {
        let totalSize = 0;
        
        try {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const stats = fs.statSync(itemPath);
                
                if (stats.isDirectory()) {
                    totalSize += this.getDirectorySize(itemPath);
                } else {
                    totalSize += stats.size;
                }
            }
        } catch (error) {
            // Ignore permission errors
        }
        
        return totalSize;
    }

    /**
     * Format bytes to human readable format
     * @param {number} bytes - Number of bytes
     * @returns {string} - Formatted string
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get Playwright browser launch options with profile
     * @param {string} profileName - Name of the profile
     * @param {Object} additionalOptions - Additional Playwright options
     * @returns {Object} - Playwright launch options
     */
    getPlaywrightOptions(profileName, additionalOptions = {}) {
        const profilePath = this.createProfile(profileName);
        
        return {
            headless: false,
            userDataDir: profilePath,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ],
            ...additionalOptions
        };
    }

    /**
     * Get Puppeteer browser launch options with profile
     * @param {string} profileName - Name of the profile
     * @param {Object} additionalOptions - Additional Puppeteer options
     * @returns {Object} - Puppeteer launch options
     */
    getPuppeteerOptions(profileName, additionalOptions = {}) {
        const profilePath = this.createProfile(profileName);
        
        return {
            headless: false,
            userDataDir: profilePath,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            ...additionalOptions
        };
    }
}

export { BrowserProfileManager };
