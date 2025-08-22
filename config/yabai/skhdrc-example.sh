# ===== SKHD CONFIG FOR DEVELOPMENT =====
# Optimized for yabai window management with Cursor, Claude, Terminal

# ===== WINDOW FOCUS =====
# Focus window in direction
alt - h : yabai -m window --focus west
alt - j : yabai -m window --focus south
alt - k : yabai -m window --focus north
alt - l : yabai -m window --focus east

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
# Resize windows
shift + alt - a : yabai -m window --resize left:-50:0; yabai -m window --resize right:-50:0
shift + alt - s : yabai -m window --resize bottom:0:50; yabai -m window --resize top:0:50
shift + alt - w : yabai -m window --resize top:0:-50; yabai -m window --resize bottom:0:-50
shift + alt - d : yabai -m window --resize right:50:0; yabai -m window --resize left:50:0

# Equalize all windows
shift + alt - 0 : yabai -m space --balance

# ===== SPACE MANAGEMENT =====
# Focus space
cmd - 1 : yabai -m space --focus 1
cmd - 2 : yabai -m space --focus 2
cmd - 3 : yabai -m space --focus 3
cmd - 4 : yabai -m space --focus 4
cmd - 5 : yabai -m space --focus 5
cmd - 6 : yabai -m space --focus 6

# Move window to space and follow
shift + cmd - 1 : yabai -m window --space 1; yabai -m space --focus 1
shift + cmd - 2 : yabai -m window --space 2; yabai -m space --focus 2
shift + cmd - 3 : yabai -m window --space 3; yabai -m space --focus 3
shift + cmd - 4 : yabai -m window --space 4; yabai -m space --focus 4
shift + cmd - 5 : yabai -m window --space 5; yabai -m space --focus 5
shift + cmd - 6 : yabai -m window --space 6; yabai -m space --focus 6

# Move window to space (don't follow)
shift + alt - 1 : yabai -m window --space 1
shift + alt - 2 : yabai -m window --space 2
shift + alt - 3 : yabai -m window --space 3
shift + alt - 4 : yabai -m window --space 4
shift + alt - 5 : yabai -m window --space 5
shift + alt - 6 : yabai -m window --space 6

# Create/destroy spaces
cmd + alt - n : yabai -m space --create && yabai -m space --focus last
cmd + alt - x : yabai -m space --destroy

# ===== LAYOUT CONTROLS =====
# Toggle layout
alt - space : yabai -m space --layout $(yabai -m query --spaces --space | jq -r 'if .type == "bsp" then "stack" else "bsp" end')

# Toggle window float
shift + alt - space : yabai -m window --toggle float --grid 4:4:1:1:2:2

# Screenshot mode - smart conditional sizing (corrected progression)
cmd + shift + alt - 1 : \
    if [ $(yabai -m query --windows --space | jq 'length') -eq 1 ]; then \
        yabai -m window --toggle float; yabai -m window --grid 6:6:1:1:4:4; \
    else \
        yabai -m space --create; yabai -m window --space last; yabai -m space --focus last; yabai -m config --space last layout float; yabai -m window --toggle float; yabai -m window --grid 6:6:1:1:4:4; \
    fi

cmd + shift + alt - 2 : yabai -m window --grid 8:8:2:2:4:4
cmd + shift + alt - 3 : yabai -m window --grid 10:10:1:1:7:7

# Return from screenshot mode - smart cleanup
cmd + shift + alt - 0 : \
    if [ $(yabai -m query --windows --space | jq 'length') -eq 1 ] && [ $(yabai -m query --spaces | jq 'map(select(.["has-focus"] == true)) | .[0].index') -gt 8 ]; then \
        yabai -m window --space 1; yabai -m space --focus 1; yabai -m space --destroy last; \
    else \
        yabai -m window --space 1; yabai -m space --focus 1; \
    fi

# Toggle window fullscreen
alt - f : yabai -m window --toggle zoom-fullscreen

# Toggle window native fullscreen
shift + alt - f : yabai -m window --toggle native-fullscreen

# Rotate space
alt - r : yabai -m space --rotate 90

# Mirror space
alt - y : yabai -m space --mirror y-axis
alt - x : yabai -m space --mirror x-axis

# ===== COMMAND CENTER SHORTCUTS =====
# Quick app launches (safe cmd+alt+letter pattern)
cmd + alt - w : open -a "Warp"
cmd + alt - c : open -a "Cursor"
cmd + alt - s : open -a "Sequel Pro"
# cmd + alt - a : open -a "Activity Monitor"  # if needed
# cmd + alt - n : open -a "Notion"           # if needed

# Claude Desktop toggle (float/unfloat)
cmd + alt - q : yabai -m window --toggle float; yabai -m window --toggle sticky; yabai -m window --toggle topmost

# Command center modes (with scripting addition power)
# Focus mode - hide all but current app
cmd + alt - f : yabai -m space --layout stack; yabai -m window --focus largest

# Communication mode - move all communication apps to left display
cmd + alt - s : yabai -m window --space 6 app="^Slack$"; yabai -m window --space 7 app="^Discord$"; yabai -m window --space 8 app="^Telegram$"

# Development mode - organize dev tools on center display
cmd + alt - d : yabai -m window --space 1 app="^Cursor$"; yabai -m window --space 2 app="^Warp$"; yabai -m window --space 3 app="^Arc$"

# Monitoring mode - stack monitoring tools on right display
cmd + alt - m : yabai -m window --space 5 app="^Activity Monitor$"; yabai -m space 5 --layout stack

# ===== WINDOW STACKING =====
# Stack windows
ctrl + alt - h : yabai -m window west --stack $(yabai -m query --windows --window | jq -r '.id')
ctrl + alt - j : yabai -m window south --stack $(yabai -m query --windows --window | jq -r '.id')
ctrl + alt - k : yabai -m window north --stack $(yabai -m query --windows --window | jq -r '.id')
ctrl + alt - l : yabai -m window east --stack $(yabai -m query --windows --window | jq -r '.id')

# Unstack window
ctrl + alt - u : yabai -m window --toggle float && yabai -m window --toggle float

# ===== SYSTEM CONTROLS =====
# Restart yabai
ctrl + alt + cmd - r : brew services restart yabai

# Restart skhd
ctrl + alt + cmd - s : brew services restart skhd

# ===== MOUSE INTEGRATION =====
# Enable mouse resize with fn key (already configured in yabairc)
# fn + left click = move window
# fn + right click = resize window
