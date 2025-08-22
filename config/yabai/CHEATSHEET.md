# 🎙️ YABAI COMMAND CENTER - DESK REFERENCE

## 🚨 EMERGENCY (When Stuck)
```
yabai --restart-service     Restart yabai (with scripting addon)
skhd --restart-service      Restart skhd (proper service restart)
shift + alt + space         Float current window
shift + alt + 0             Balance all windows
alt + space                 Toggle layout (BSP ↔ Stack)
```

## 🎥 PODCAST ESSENTIALS
```
alt + f                     Fullscreen current app
shift + alt + f             Native fullscreen (hides menu bar)
cmd + 1/2/3/4               Switch spaces on center display
cmd + alt + c               Launch Cursor
cmd + alt + w               Launch Warp
cmd + alt + t               Launch Terminal
cmd + alt + r               Launch Reminders
```

## 📸 SCREENSHOT MODE (SMART!)
```
cmd + shift + alt + 1       Smart resize: Medium (1667×899) - good default
cmd + shift + alt + 2       Resize to small (1250×674) - compact
cmd + shift + alt + 3       Resize to large (1750×944) - 70% centered
cmd + shift + alt + 0       Smart return: Cleanup new spaces, keep existing ones
```

## 🧭 BASIC NAVIGATION
```
alt + h/j/k/l              Focus window (←↓↑→)
cmd + 1-6                  Switch spaces
shift + cmd + 1-6          Move window to space & follow
```

## 🔧 QUICK FIXES
```
shift + alt + space        Float/unfloat window
cmd + alt + q              Claude Desktop toggle
alt + r                    Rotate space 90°
```

## 🎯 WORKFLOWS

**Smart Screenshot Workflow:**
1. `cmd + shift + alt + 1` (smart sizing - in place if alone, new space if not)
2. Adjust size: `cmd + shift + alt + 2/3` (resize same window)
3. Done? `cmd + shift + alt + 0` (smart cleanup - preserves existing spaces)

**Podcast Workflow:**
1. `alt + f` (fullscreen current app)
2. If stuck: `yabai --restart-service`
3. `cmd + 1` (back to main space)

**Emergency Reset:**
1. `yabai --restart-service` (with scripting addon)
2. `skhd --restart-service` (proper service restart)  
3. `shift + alt + 0` (balance windows)

**Pro Tips:**
- Space 5 = Everything floats automatically
- Reminders floats everywhere (no space restriction)
- Screenshot mode preserves existing spaces, only creates when needed
