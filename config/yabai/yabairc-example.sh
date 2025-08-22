#!/usr/bin/env sh

# ===== YABAI CONFIG FOR DEVELOPMENT =====
# Optimized for Cursor, Claude Desktop, Terminal, and general dev work

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
yabai -m config split_ratio                  0.70
yabai -m config auto_balance                 off
yabai -m config mouse_modifier               alt
yabai -m config mouse_action1                move
yabai -m config mouse_action2                resize
yabai -m config mouse_drop_action            swap

# ===== LAYOUT SETTINGS =====
yabai -m config layout                       bsp
yabai -m config top_padding                  15
yabai -m config bottom_padding               15
yabai -m config left_padding                 15
yabai -m config right_padding                15
yabai -m config window_gap                   15

# ===== APP-SPECIFIC RULES =====

# Development Tools - Always tile
yabai -m rule --add app="^Cursor$" manage=on
yabai -m rule --add app="^Visual Studio Code$" manage=on
yabai -m rule --add app="^Terminal$" manage=on
yabai -m rule --add app="^iTerm2$" manage=on
yabai -m rule --add app="^Warp$" manage=on

# Browsers - Tile but with specific handling
yabai -m rule --add app="^Safari$" manage=on
yabai -m rule --add app="^Google Chrome$" manage=on
yabai -m rule --add app="^Arc$" manage=on
yabai -m rule --add app="^Firefox$" manage=on

# Communication - Float small windows, tile large ones
yabai -m rule --add app="^Slack$" manage=on
yabai -m rule --add app="^Discord$" manage=on
yabai -m rule --add app="^Telegram$" manage=on

# System/Utility Apps - Always float
yabai -m rule --add app="^System Preferences$" manage=off
yabai -m rule --add app="^System Settings$" manage=off
yabai -m rule --add app="^Activity Monitor$" manage=off
yabai -m rule --add app="^Finder$" manage=off
yabai -m rule --add app="^Calculator$" manage=off
yabai -m rule --add app="^Digital Color Meter$" manage=off
yabai -m rule --add app="^ColorSync Utility$" manage=off
yabai -m rule --add app="^Dictionary$" manage=off
yabai -m rule --add app="^Software Update$" manage=off
yabai -m rule --add app="^About This Mac$" manage=off
yabai -m rule --add app="^Reminders$" manage=off

# Removed duplicate rules - using space-specific rules below

# Media Apps - Float
yabai -m rule --add app="^Music$" manage=off
yabai -m rule --add app="^soundCloud$" manage=off
yabai -m rule --add app="^Spotify$" manage=off
yabai -m rule --add app="^VLC$" manage=off
yabai -m rule --add app="^QuickTime Player$" manage=off

# Design/Creative - Tile large windows, float palettes
yabai -m rule --add app="^Figma$" manage=on
yabai -m rule --add app="^Adobe.*$" manage=on
yabai -m rule --add app="^Sketch$" manage=on

# Command center app rules with scripting addition
# Communication apps - auto-assign to left display
yabai -m rule --add app="^Slack$" space=6 manage=on
yabai -m rule --add app="^Discord$" space=7 manage=on  
yabai -m rule --add app="^Telegram$" space=8 manage=on
yabai -m rule --add app="^WhatsApp$" space=8 manage=on

# Development apps - auto-assign to center display
yabai -m rule --add app="^Cursor$" space=1 manage=on
yabai -m rule --add app="^Visual Studio Code$" space=1 manage=on
yabai -m rule --add app="^Arc$" space=3 manage=on
yabai -m rule --add app="^Warp$" space=2 manage=on
yabai -m rule --add app="^Terminal$" space=2 manage=on
yabai -m rule --add app="^iTerm2$" space=2 manage=on

# Claude Desktop - tiled normally (not floating)
yabai -m rule --add app="^Claude$" space=2 manage=on

# Right display apps - floating on space 5
yabai -m rule --add app="^Activity Monitor$" space=5 manage=off 
yabai -m rule --add app="^Console$" space=5 manage=off
yabai -m rule --add app="^Postgres$" space=5 manage=off
yabai -m rule --add app="^Transmit$" space=5 manage=off
yabai -m rule --add app="^Finder$" space=5 manage=off
yabai -m rule --add app="^Local$" space=5 manage=off

# Note-taking apps - left display
yabai -m rule --add app="^Obsidian$" space=7 manage=on
yabai -m rule --add app="^Notion$" space=7 manage=on
yabai -m rule --add app="^Bear$" space=7 manage=on

# Specific window rules
yabai -m rule --add title="^(Opening|Preferences|Settings).*$" manage=off
yabai -m rule --add title="^Archive Utility$" manage=off

# ===== SPACE-SPECIFIC LAYOUTS =====
# CENTER STUDIO DISPLAY (Web & Development)
yabai -m config --space 1 layout bsp    # Main development
yabai -m config --space 2 layout bsp    # Secondary development  
yabai -m config --space 3 layout bsp    # Web browsing
yabai -m config --space 4 layout bsp    # Extra dev space

# RIGHT VERTICAL DISPLAY (Tools & Scratch - always float)
yabai -m config --space 5 layout float  # All apps float on this display

# LEFT DISPLAY (Social & Notes)
yabai -m config --space 6 layout bsp    # Social apps
yabai -m config --space 7 layout bsp    # Notes/docs
yabai -m config --space 8 layout bsp    # Extra social/notes

# ===== INTEGRATION =====
# Sketchybar
yabai -m config external_bar all:32:0


# ===== SIGNALS =====
# Restart yabai when dock restarts
yabai -m signal --add event=dock_did_restart action="sudo yabai --load-sa"

# Auto-load scripting addition on startup
sudo yabai --load-sa

echo "yabai configuration loaded"