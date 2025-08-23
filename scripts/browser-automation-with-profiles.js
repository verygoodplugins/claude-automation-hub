/**
 * Enhanced Browser Automation with Profile Support
 * MCP Tool for browser automation with persistent login sessions
 */

import { BrowserProfileManager } from '../src/browser/profile-manager.js';

class BrowserAutomationWithProfiles {
    constructor() {
        this.profileManager = new BrowserProfileManager();
        this.activeBrowsers = new Map();
    }

    /**
     * Launch browser with profile
     * @param {string} profileName - Name of the browser profile
     * @param {string} browserType - 'chromium', 'firefox', or 'webkit'
     * @param {Object} options - Additional browser options
     * @returns {Object} - Browser instance and context
     */
    async launchWithProfile(profileName, browserType = 'chromium', options = {}) {
        try {
            // Import Playwright dynamically
            const playwright = await import('playwright');
            const { chromium, firefox, webkit } = playwright;
            
            const browsers = { chromium, firefox, webkit };
            const browser = browsers[browserType];
            
            if (!browser) {
                throw new Error(`Unsupported browser type: ${browserType}`);
            }
            
            // Get profile-specific launch options
            const profileOptions = this.profileManager.getPlaywrightOptions(profileName, {
                ...options,
                headless: options.headless || false
            });
            
            console.log(`🚀 Launching ${browserType} with profile: ${profileName}`);
            
            const browserInstance = await browser.launch(profileOptions);
            const context = await browserInstance.newContext();
            const page = await context.newPage();
            
            // Store browser instance for cleanup
            const sessionId = `${profileName}-${Date.now()}`;
            this.activeBrowsers.set(sessionId, {
                browser: browserInstance,
                context,
                page,
                profileName,
                browserType
            });
            
            return {
                sessionId,
                browser: browserInstance,
                context,
                page,
                profilePath: this.profileManager.getProfilePath(profileName)
            };
            
        } catch (error) {
            console.error(`❌ Failed to launch browser with profile ${profileName}:`, error.message);
            throw error;
        }
    }

    /**
     * Navigate to a URL with login session persistence
     * @param {string} sessionId - Browser session ID
     * @param {string} url - URL to navigate to
     * @param {Object} options - Navigation options
     * @returns {Object} - Navigation result
     */
    async navigateWithSession(sessionId, url, options = {}) {
        const session = this.activeBrowsers.get(sessionId);
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }
        
        console.log(`🌐 Navigating to: ${url} (Profile: ${session.profileName})`);
        
        try {
            await session.page.goto(url, {
                waitUntil: 'networkidle',
                ...options
            });
            
            // Check if we're already logged in by looking for common login indicators
            const loginIndicators = await this.checkLoginStatus(session.page);
            
            return {
                url: session.page.url(),
                title: await session.page.title(),
                loginStatus: loginIndicators,
                profileName: session.profileName
            };
            
        } catch (error) {
            console.error(`❌ Navigation failed:`, error.message);
            throw error;
        }
    }

    /**
     * Check login status on current page
     * @param {Object} page - Playwright page object
     * @returns {Object} - Login status information
     */
    async checkLoginStatus(page) {
        try {
            // Common login indicators
            const loginSelectors = [
                'input[type="password"]',
                'button[type="submit"]:has-text("Login")',
                'button[type="submit"]:has-text("Sign In")',
                'a:has-text("Login")',
                'a:has-text("Sign In")'
            ];
            
            const logoutSelectors = [
                'button:has-text("Logout")',
                'button:has-text("Sign Out")',
                'a:has-text("Logout")',
                'a:has-text("Sign Out")',
                '.user-menu',
                '.profile-menu'
            ];
            
            const hasLoginElements = await Promise.all(
                loginSelectors.map(selector => 
                    page.locator(selector).count().then(count => count > 0)
                )
            );
            
            const hasLogoutElements = await Promise.all(
                logoutSelectors.map(selector => 
                    page.locator(selector).count().then(count => count > 0)
                )
            );
            
            const needsLogin = hasLoginElements.some(Boolean);
            const isLoggedIn = hasLogoutElements.some(Boolean);
            
            return {
                needsLogin,
                isLoggedIn,
                status: isLoggedIn ? 'logged_in' : (needsLogin ? 'needs_login' : 'unknown')
            };
            
        } catch (error) {
            return {
                needsLogin: false,
                isLoggedIn: false,
                status: 'error',
                error: error.message
            };
        }
    }

    /**
     * Perform automated login
     * @param {string} sessionId - Browser session ID
     * @param {Object} credentials - Login credentials
     * @param {Object} selectors - Custom selectors for login form
     * @returns {Object} - Login result
     */
    async performLogin(sessionId, credentials, selectors = {}) {
        const session = this.activeBrowsers.get(sessionId);
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }
        
        const defaultSelectors = {
            username: 'input[type="email"], input[name="username"], input[name="email"]',
            password: 'input[type="password"]',
            submit: 'button[type="submit"], input[type="submit"]',
            ...selectors
        };
        
        console.log(`🔐 Attempting login for profile: ${session.profileName}`);
        
        try {
            // Fill username
            await session.page.fill(defaultSelectors.username, credentials.username);
            await session.page.waitForTimeout(500);
            
            // Fill password
            await session.page.fill(defaultSelectors.password, credentials.password);
            await session.page.waitForTimeout(500);
            
            // Submit form
            await session.page.click(defaultSelectors.submit);
            
            // Wait for navigation or login completion
            await session.page.waitForLoadState('networkidle', { timeout: 10000 });
            
            // Check if login was successful
            const loginStatus = await this.checkLoginStatus(session.page);
            
            if (loginStatus.isLoggedIn) {
                console.log(`✅ Login successful for profile: ${session.profileName}`);
            } else {
                console.log(`⚠️  Login may have failed for profile: ${session.profileName}`);
            }
            
            return {
                success: loginStatus.isLoggedIn,
                url: session.page.url(),
                title: await session.page.title(),
                loginStatus
            };
            
        } catch (error) {
            console.error(`❌ Login failed:`, error.message);
            throw error;
        }
    }

    /**
     * Close browser session
     * @param {string} sessionId - Browser session ID
     */
    async closeSession(sessionId) {
        const session = this.activeBrowsers.get(sessionId);
        if (!session) {
            console.log(`⚠️  Session ${sessionId} not found`);
            return;
        }
        
        try {
            await session.browser.close();
            this.activeBrowsers.delete(sessionId);
            console.log(`✅ Closed browser session: ${sessionId} (Profile: ${session.profileName})`);
        } catch (error) {
            console.error(`❌ Error closing session:`, error.message);
        }
    }

    /**
     * Close all active sessions
     */
    async closeAllSessions() {
        const sessions = Array.from(this.activeBrowsers.keys());
        console.log(`🧹 Closing ${sessions.length} active session(s)...`);
        
        await Promise.all(sessions.map(sessionId => this.closeSession(sessionId)));
    }

    /**
     * List active sessions
     * @returns {Array} - List of active sessions
     */
    listActiveSessions() {
        const sessions = [];
        
        for (const [sessionId, session] of this.activeBrowsers) {
            sessions.push({
                sessionId,
                profileName: session.profileName,
                browserType: session.browserType,
                url: session.page?.url() || 'unknown'
            });
        }
        
        return sessions;
    }

    /**
     * Get MCP tool definitions
     * @returns {Array} - MCP tool definitions
     */
    getMCPTools() {
        return [
            {
                name: 'launch_browser_with_profile',
                description: 'Launch a browser with a persistent profile for maintaining login sessions',
                inputSchema: {
                    type: 'object',
                    properties: {
                        profileName: {
                            type: 'string',
                            description: 'Name of the browser profile (e.g., "gmail-work", "social-media")'
                        },
                        browserType: {
                            type: 'string',
                            enum: ['chromium', 'firefox', 'webkit'],
                            default: 'chromium',
                            description: 'Type of browser to launch'
                        },
                        headless: {
                            type: 'boolean',
                            default: false,
                            description: 'Run browser in headless mode'
                        }
                    },
                    required: ['profileName']
                }
            },
            {
                name: 'navigate_with_session',
                description: 'Navigate to a URL using an existing browser session with saved login state',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sessionId: {
                            type: 'string',
                            description: 'Browser session ID from launch_browser_with_profile'
                        },
                        url: {
                            type: 'string',
                            description: 'URL to navigate to'
                        }
                    },
                    required: ['sessionId', 'url']
                }
            },
            {
                name: 'perform_login',
                description: 'Perform automated login and save session to profile',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sessionId: {
                            type: 'string',
                            description: 'Browser session ID'
                        },
                        credentials: {
                            type: 'object',
                            properties: {
                                username: { type: 'string' },
                                password: { type: 'string' }
                            },
                            required: ['username', 'password']
                        },
                        selectors: {
                            type: 'object',
                            description: 'Custom CSS selectors for login form elements',
                            properties: {
                                username: { type: 'string' },
                                password: { type: 'string' },
                                submit: { type: 'string' }
                            }
                        }
                    },
                    required: ['sessionId', 'credentials']
                }
            }
        ];
    }
}

export { BrowserAutomationWithProfiles };
