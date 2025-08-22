#!/usr/bin/env sh

# ===== YABAI CONFIG FOR AI DEVELOPMENT =====
# Optimized for Claude Desktop, Cursor IDE, and modern AI workflows
# Works with 1-2 monitors (adapts automatically)

# ===== GLOBAL SETTINGS =====
yabai -m config mouse_follows_focus          on
yabai -m config focus_follows_mouse          off
yabai -m config window_origin_display        default
yabai -m config window_placement             second_child
yabai -m config window_shadow                on
yabai -m config window_opacity               off
yabai -m config window_opacity_duration      0.0
yabai -m config active_window_opacity        1.0
yabai -m config normal_window_opacity        0.90
yabai -m config insert_feedback_color        0xffd75f5f
yabai -m config split_ratio                  0.60
yabai -m config auto_balance                 off
yabai -m config mouse_modifier               alt
yabai -m config mouse_action1                move
yabai -m config mouse_action2                resize
yabai -m config mouse_drop_action            swap

# ===== LAYOUT SETTINGS =====
yabai -m config layout                       bsp
yabai -m config top_padding                  12
yabai -m config bottom_padding               12
yabai -m config left_padding                 12
yabai -m config right_padding                12
yabai -m config window_gap                   12

# ===== AI DEVELOPMENT TOOLS - ALWAYS TILE =====
# Code Editors
yabai -m rule --add app="^Cursor$" manage=on
yabai -m rule --add app="^Visual Studio Code$" manage=on
yabai -m rule --add app="^Sublime Text$" manage=on
yabai -m rule --add app="^IntelliJ IDEA$" manage=on

# AI Assistants - Special handling
yabai -m rule --add app="^Claude$" manage=on
yabai -m rule --add app="^ChatGPT$" manage=on
yabai -m rule --add app="^GitHub Copilot$" manage=on

# Terminals
yabai -m rule --add app="^Terminal$" manage=on
yabai -m rule --add app="^iTerm2$" manage=on
yabai -m rule --add app="^Warp$" manage=on
yabai -m rule --add app="^Alacritty$" manage=on

# Browsers
yabai -m rule --add app="^Safari$" manage=on
yabai -m rule --add app="^Google Chrome$" manage=on
yabai -m rule --add app="^Arc$" manage=on
yabai -m rule --add app="^Firefox$" manage=on
yabai -m rule --add app="^Brave Browser$" manage=on

# ===== DEVELOPMENT SUPPORT TOOLS =====
# Database Tools
yabai -m rule --add app="^TablePlus$" manage=on
yabai -m rule --add app="^Sequel Pro$" manage=on
yabai -m rule --add app="^Postgres$" manage=on
yabai -m rule --add app="^MongoDB Compass$" manage=on

# API Tools
yabai -m rule --add app="^Postman$" manage=on
yabai -m rule --add app="^Insomnia$" manage=on
yabai -m rule --add app="^Paw$" manage=on

# Version Control
yabai -m rule --add app="^GitHub Desktop$" manage=on
yabai -m rule --add app="^Tower$" manage=on
yabai -m rule --add app="^SourceTree$" manage=on

# ===== COMMUNICATION TOOLS =====
yabai -m rule --add app="^Slack$" manage=on
yabai -m rule --add app="^Discord$" manage=on
yabai -m rule --add app="^Microsoft Teams$" manage=on
yabai -m rule --add app="^Zoom$" manage=off  # Float for better control

# ===== DOCUMENTATION & NOTES =====
yabai -m rule --add app="^Obsidian$" manage=on
yabai -m rule --add app="^Notion$" manage=on
yabai -m rule --add app="^Bear$" manage=on
yabai -m rule --add app="^Craft$" manage=on

# ===== SYSTEM APPS - ALWAYS FLOAT =====
yabai -m rule --add app="^System Preferences$" manage=off
yabai -m rule --add app="^System Settings$" manage=off
yabai -m rule --add app="^Activity Monitor$" manage=off
yabai -m rule --add app="^Finder$" manage=off
yabai -m rule --add app="^Calculator$" manage=off
yabai -m rule --add app="^Preview$" manage=off
yabai -m rule --add app="^About This Mac$" manage=off

# ===== MEDIA APPS - FLOAT =====
yabai -m rule --add app="^Music$" manage=off
yabai -m rule --add app="^Spotify$" manage=off
yabai -m rule --add app="^VLC$" manage=off
yabai -m rule --add app="^QuickTime Player$" manage=off

# ===== WINDOW TITLE RULES =====
yabai -m rule --add title="^(Opening|Preferences|Settings).*$" manage=off
yabai -m rule --add title="^Archive Utility$" manage=off

# ===== SPACE-SPECIFIC LAYOUTS =====
# Space 1: Main development (Code + AI)
yabai -m config --space 1 layout bsp

# Space 2: Terminal & Tools
yabai -m config --space 2 layout bsp

# Space 3: Browsers & Documentation
yabai -m config --space 3 layout bsp

# Space 4: Communication
yabai -m config --space 4 layout bsp

# Space 5: Floating workspace
yabai -m config --space 5 layout float

# ===== OPTIONAL: External Status Bar =====
# Uncomment if using Sketchybar or similar
# yabai -m config external_bar all:32:0

# ===== SIGNALS =====
# Restart yabai when dock restarts
yabai -m signal --add event=dock_did_restart action="sudo yabai --load-sa"

# ===== OPTIONAL: Scripting Addition =====
# Uncomment if you have disabled SIP and want advanced features
# sudo yabai --load-sa

echo "yabai AI development configuration loaded"