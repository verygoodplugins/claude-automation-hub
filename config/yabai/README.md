# Yabai Window Manager Configuration Examples 🪟

This directory contains example configurations for [yabai](https://github.com/koekeishiya/yabai), a tiling window manager for macOS, and [skhd](https://github.com/koekeishiya/skhd), the hotkey daemon that provides keyboard shortcuts.

## What is Yabai?

Yabai is a window management utility for macOS built on top of the macOS Accessibility API. It allows you to control windows, spaces, and displays using a powerful command-line interface and keyboard shortcuts. It's particularly useful for developers who want to maximize screen real estate and improve workflow efficiency.

**Key Benefits:**
- **Automatic window tiling** - No more manual window resizing
- **Keyboard-driven workflow** - Reduce mouse usage significantly  
- **Space management** - Organize work across multiple virtual desktops
- **Application-specific rules** - Different behavior for different apps
- **Performance boost** - Faster window navigation and management

## Performance Impact

Many users report significant productivity improvements:
- **Faster window navigation** - Jump between windows instantly with keyboard shortcuts
- **Better screen utilization** - Automatic tiling maximizes usable space
- **Reduced context switching** - Less time spent arranging windows manually
- **Improved focus** - Dedicated spaces for different types of work

## Configuration Files

### 📁 Available Examples

| File | Description | Best For |
|------|-------------|----------|
| `yabairc-example.sh` | **Development-optimized config** - Your personal configuration with app-specific rules for Cursor, Claude Desktop, Terminal, and development tools | Developers using Cursor IDE and Claude Desktop |
| `skhdrc-example.sh` | **Development keyboard shortcuts** - Your personal shortcuts optimized for development workflow | Developers who want comprehensive keyboard control |
| `yabairc-minimal.sh` | **Minimal configuration** - Simple setup based on community best practices | Beginners or users who want basic tiling |
| `skhdrc-popular.sh` | **Popular shortcuts** - Community-favorite keyboard shortcuts from popular dotfiles | Users who want proven shortcut patterns |

### 🚀 Your Development Configuration

The `*-example.sh` files contain your personal configurations, optimized for:

**Development Tools (Always Tiled):**
- Cursor IDE
- Visual Studio Code  
- Terminal/iTerm2/Warp
- Browsers (Safari, Chrome, Arc, Firefox)

**Communication Apps (Smart Handling):**
- Slack, Discord, Telegram (tile large windows, float small ones)

**System Apps (Always Float):**
- System Preferences/Settings
- Finder, Calculator
- Media apps (Music, Spotify, VLC)

**Special Features:**
- **Screenshot mode** - Dedicated space 6 for presentations
- **Claude Desktop toggle** - Quick float/unfloat for AI assistance
- **Space-specific layouts** - BSP for development, Stack for communication
- **Smart window sizing** - Grid-based positioning for specific apps

## Installation & Setup

### 1. Install Dependencies

```bash
# Install yabai and skhd via Homebrew
brew install koekeishiya/formulae/yabai
brew install koekeishiya/formulae/skhd

# Start services
brew services start yabai
brew services start skhd
```

### 2. Configure System Permissions

Yabai requires accessibility permissions:

1. **System Preferences** → **Security & Privacy** → **Privacy** → **Accessibility**
2. Add and enable both `yabai` and `skhd`
3. You may need to restart the services after granting permissions

### 3. Install Configuration

Choose one of the example configurations:

```bash
# Copy your development-optimized config
cp config/yabai/yabairc-example.sh ~/.config/yabai/yabairc
cp config/yabai/skhdrc-example.sh ~/.config/skhd/skhdrc

# OR copy the minimal config for beginners
cp config/yabai/yabairc-minimal.sh ~/.config/yabai/yabairc
cp config/yabai/skhdrc-popular.sh ~/.config/skhd/skhdrc

# Make yabairc executable
chmod +x ~/.config/yabai/yabairc

# Restart services to apply changes
brew services restart yabai
brew services restart skhd
```

### 4. Optional: Scripting Addition (Advanced)

For advanced features like window opacity and borders:

```bash
# Install scripting addition (requires SIP to be partially disabled)
sudo yabai --install-sa

# Load scripting addition
sudo yabai --load-sa
```

**Note:** This requires disabling System Integrity Protection (SIP) partially. See [yabai documentation](https://github.com/koekeishiya/yabai/wiki/Disabling-System-Integrity-Protection) for details.

## 📄 Quick Reference

**[🖨️ Printable Cheat Sheet](../../docs/yabai-cheatsheet.html)** - One-page reference optimized for printing and desk use

For the complete markdown version, see [CHEATSHEET.md](CHEATSHEET.md).

## Key Shortcuts (Development Config)

### Window Navigation
- `Alt + H/J/K/L` - Focus window in direction (left/down/up/right)
- `Alt + N/P` - Focus next/previous window in stack

### Window Movement  
- `Shift + Alt + H/J/K/L` - Swap windows
- `Shift + Cmd + H/J/K/L` - Warp windows (move and follow)

### Window Resizing
- `Shift + Alt + A/S/W/D` - Resize window (left/down/up/right)
- `Shift + Alt + 0` - Balance all windows

### Space Management
- `Cmd + 1-6` - Focus space
- `Shift + Cmd + 1-6` - Move window to space and follow
- `Shift + Alt + 1-6` - Move window to space (don't follow)

### Layout Controls
- `Alt + Space` - Toggle between BSP and Stack layout
- `Shift + Alt + Space` - Toggle window float
- `Alt + F` - Toggle fullscreen

### Development Shortcuts
- `Cmd + Alt + Return` - Open Terminal
- `Cmd + Alt + C` - Open Cursor
- `Cmd + Alt + B` - Open Arc Browser
- `Cmd + Alt + Q` - Toggle Claude Desktop float/sticky/topmost

### Screenshot Mode
- `Cmd + Shift + Alt + 1/2/3` - Move window to space 6 with different sizes
- `Cmd + Shift + Alt + 0` - Return from screenshot mode

## Customization Tips

### Adding New Applications

To add rules for new applications:

```bash
# Find the app name
yabai -m query --windows | jq '.[] | select(.focused==1) | .app'

# Add rule to yabairc
yabai -m rule --add app="^YourApp$" manage=on
```

### Creating Custom Shortcuts

Add to your `skhdrc`:

```bash
# Custom shortcut format
modifier - key : yabai -m [command]

# Example: Focus specific app
cmd + alt - m : yabai -m window --focus $(yabai -m query --windows | jq '.[] | select(.app=="Music") | .id')
```

### Space-Specific Layouts

Configure different layouts per space:

```bash
# In yabairc
yabai -m config --space 1 layout bsp     # Development
yabai -m config --space 2 layout stack   # Communication  
yabai -m config --space 3 layout float   # Media
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Shortcuts not working** | Check accessibility permissions for skhd |
| **Windows not tiling** | Verify yabai accessibility permissions |
| **Config not loading** | Check file permissions: `chmod +x ~/.config/yabai/yabairc` |
| **Service won't start** | Try `brew services restart yabai` |

### Debug Commands

```bash
# Check yabai status
brew services list | grep yabai

# View yabai logs
tail -f /usr/local/var/log/yabai/yabai.out.log

# Test skhd shortcuts
skhd --verbose

# Query current window info
yabai -m query --windows --window
```

### Reset Configuration

```bash
# Stop services
brew services stop yabai
brew services stop skhd

# Remove configs
rm ~/.config/yabai/yabairc
rm ~/.config/skhd/skhdrc

# Restart with default settings
brew services start yabai
brew services start skhd
```

## Popular Community Configurations

Here are some highly-starred GitHub repositories with excellent yabai configurations:

- **[Julian-Heng/yabai-config](https://github.com/Julian-Heng/yabai-config)** - Comprehensive setup with detailed configurations
- **[DucNgn/chunkwm-yabai-config](https://github.com/DucNgn/chunkwm-yabai-config)** - Personal configurations and scripts
- **[Shammyshanks/Yabai-SKHD-Config](https://github.com/Shammyshanks/Yabai-SKHD-Config)** - Special features and integrations

## Integration with Claude Automation Hub

Yabai enhances your automation workflows by:

- **Consistent window layouts** - Predictable app positioning for screenshots and screen sharing
- **Faster context switching** - Jump between development tools instantly
- **Space organization** - Dedicated spaces for different workflow types
- **Reduced manual window management** - More time for actual development

### Workflow Integration Examples

**Morning Routine Enhancement:**
```markdown
1. Focus development space (Cmd + 1)
2. Open Cursor (Cmd + Alt + C) - auto-tiles
3. Open Terminal (Cmd + Alt + Return) - auto-tiles beside Cursor
4. Toggle Claude Desktop (Cmd + Alt + Q) - floats for easy access
```

**Focus Mode Enhancement:**
```markdown
1. Switch to dedicated focus space (Cmd + 2)
2. All distractions automatically filtered by app rules
3. Development tools auto-tile for maximum screen usage
4. Communication apps moved to separate space
```

## Resources

- **[Official Yabai Documentation](https://github.com/koekeishiya/yabai)**
- **[SKHD Documentation](https://github.com/koekeishiya/skhd)**
- **[Yabai Wiki](https://github.com/koekeishiya/yabai/wiki)**
- **[Ricing macOS Guide](https://www.knlrvr.dev/writing/ricing-macos-for-beginners)**

---

**Pro Tip:** Start with the minimal configuration and gradually add features as you become comfortable with the workflow. Yabai has a learning curve, but the productivity gains are substantial once you adapt to keyboard-driven window management! 🚀

