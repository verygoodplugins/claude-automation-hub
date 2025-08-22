#!/usr/bin/env sh

# ===== SKHD CONFIG FOR AI DEVELOPMENT =====
# Keyboard shortcuts optimized for Claude Desktop, Cursor IDE, and AI workflows
# Compatible with any monitor setup

# ===== WINDOW FOCUS =====
# Focus window in direction (vim-style)
alt - h : yabai -m window --focus west
alt - j : yabai -m window --focus south
alt - k : yabai -m window --focus north
alt - l : yabai -m window --focus east

# Focus window by cycle
alt - tab : yabai -m window --focus next
shift + alt - tab : yabai -m window --focus prev

# Focus window in stack
alt - n : yabai -m window --focus stack.next
alt - p : yabai -m window --focus stack.prev

# ===== WINDOW MOVEMENT =====
# Swap windows
shift + alt - h : yabai -m window --swap west
shift + alt - j : yabai -m window --swap south
shift + alt - k : yabai -m window --swap north
shift + alt - l : yabai -m window --swap east

# Warp windows (move and follow)
shift + cmd - h : yabai -m window --warp west
shift + cmd - j : yabai -m window --warp south
shift + cmd - k : yabai -m window --warp north
shift + cmd - l : yabai -m window --warp east

# ===== WINDOW SIZING =====
# Resize windows (arrow keys for intuitive control)
shift + alt - left  : yabai -m window --resize left:-50:0 || yabai -m window --resize right:-50:0
shift + alt - down  : yabai -m window --resize bottom:0:50 || yabai -m window --resize top:0:50
shift + alt - up    : yabai -m window --resize top:0:-50 || yabai -m window --resize bottom:0:-50
shift + alt - right : yabai -m window --resize right:50:0 || yabai -m window --resize left:50:0

# Equalize all windows
shift + alt - 0 : yabai -m space --balance

# ===== SPACE MANAGEMENT =====
# Focus space (1-9)
alt - 1 : yabai -m space --focus 1
alt - 2 : yabai -m space --focus 2
alt - 3 : yabai -m space --focus 3
alt - 4 : yabai -m space --focus 4
alt - 5 : yabai -m space --focus 5
alt - 6 : yabai -m space --focus 6
alt - 7 : yabai -m space --focus 7
alt - 8 : yabai -m space --focus 8
alt - 9 : yabai -m space --focus 9

# Move window to space and follow
shift + alt - 1 : yabai -m window --space 1; yabai -m space --focus 1
shift + alt - 2 : yabai -m window --space 2; yabai -m space --focus 2
shift + alt - 3 : yabai -m window --space 3; yabai -m space --focus 3
shift + alt - 4 : yabai -m window --space 4; yabai -m space --focus 4
shift + alt - 5 : yabai -m window --space 5; yabai -m space --focus 5
shift + alt - 6 : yabai -m window --space 6; yabai -m space --focus 6
shift + alt - 7 : yabai -m window --space 7; yabai -m space --focus 7
shift + alt - 8 : yabai -m window --space 8; yabai -m space --focus 8
shift + alt - 9 : yabai -m window --space 9; yabai -m space --focus 9

# Create/destroy spaces
cmd + alt - n : yabai -m space --create && yabai -m space --focus last
cmd + alt - w : yabai -m space --destroy

# ===== LAYOUT CONTROLS =====
# Toggle between bsp and stack
alt - space : yabai -m space --layout $(yabai -m query --spaces --space | jq -r 'if .type == "bsp" then "stack" else "bsp" end')

# Toggle window float and center
shift + alt - space : yabai -m window --toggle float --grid 4:4:1:1:2:2

# Toggle fullscreen
alt - f : yabai -m window --toggle zoom-fullscreen
shift + alt - f : yabai -m window --toggle native-fullscreen

# Rotate space
alt - r : yabai -m space --rotate 90

# Mirror space
alt - y : yabai -m space --mirror y-axis
alt - x : yabai -m space --mirror x-axis

# ===== AI DEVELOPMENT SHORTCUTS =====
# Quick launch development tools
cmd + shift - c : open -a "Cursor"
cmd + shift - t : open -a "Terminal"
cmd + shift - b : open -a "Arc" || open -a "Google Chrome" || open -a "Safari"
cmd + shift - s : open -a "Slack"

# Claude Desktop controls
cmd + shift - a : open -a "Claude"
cmd + shift - q : yabai -m query --windows | jq '.[] | select(.app=="Claude") | .id' | xargs -I {} yabai -m window {} --toggle float

# ===== WINDOW POSITIONING PRESETS =====
# Left half
ctrl + alt - left : yabai -m window --grid 1:2:0:0:1:1

# Right half
ctrl + alt - right : yabai -m window --grid 1:2:1:0:1:1

# Top half
ctrl + alt - up : yabai -m window --grid 2:1:0:0:1:1

# Bottom half
ctrl + alt - down : yabai -m window --grid 2:1:0:1:1:1

# Center (floating)
ctrl + alt - c : yabai -m window --toggle float; yabai -m window --grid 6:6:1:1:4:4

# Corners
ctrl + alt - 1 : yabai -m window --grid 2:2:0:0:1:1  # Top-left
ctrl + alt - 2 : yabai -m window --grid 2:2:1:0:1:1  # Top-right
ctrl + alt - 3 : yabai -m window --grid 2:2:0:1:1:1  # Bottom-left
ctrl + alt - 4 : yabai -m window --grid 2:2:1:1:1:1  # Bottom-right

# ===== FOCUS MODES =====
# AI Pair Programming Mode (Cursor + Claude side by side)
cmd + alt - p : \
  yabai -m space --layout bsp; \
  yabai -m window --focus $(yabai -m query --windows | jq '.[] | select(.app=="Cursor") | .id'); \
  yabai -m window --grid 1:2:0:0:1:1; \
  yabai -m window --focus $(yabai -m query --windows | jq '.[] | select(.app=="Claude") | .id'); \
  yabai -m window --grid 1:2:1:0:1:1

# Deep Work Mode (single app fullscreen)
cmd + alt - d : \
  yabai -m space --layout stack; \
  yabai -m window --toggle zoom-fullscreen

# Communication Mode (focus communication space)
cmd + alt - m : yabai -m space --focus 4

# ===== WINDOW STACKING =====
# Stack with window in direction
ctrl + cmd - h : yabai -m window west --stack $(yabai -m query --windows --window | jq -r '.id')
ctrl + cmd - j : yabai -m window south --stack $(yabai -m query --windows --window | jq -r '.id')
ctrl + cmd - k : yabai -m window north --stack $(yabai -m query --windows --window | jq -r '.id')
ctrl + cmd - l : yabai -m window east --stack $(yabai -m query --windows --window | jq -r '.id')

# ===== SYSTEM CONTROLS =====
# Restart yabai
ctrl + alt + cmd - r : brew services restart yabai

# Restart skhd
ctrl + alt + cmd - s : brew services restart skhd

# ===== DISPLAY MANAGEMENT =====
# Focus display
cmd + alt - 1 : yabai -m display --focus 1
cmd + alt - 2 : yabai -m display --focus 2

# Move window to display
shift + cmd + alt - 1 : yabai -m window --display 1; yabai -m display --focus 1
shift + cmd + alt - 2 : yabai -m window --display 2; yabai -m display --focus 2

# ===== MOUSE SUPPORT =====
# Alt + left click = move window (configured in yabairc)
# Alt + right click = resize window (configured in yabairc)