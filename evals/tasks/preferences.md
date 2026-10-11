---
file: Preferences.tsx
expect: from "@danitesler/ayywi/react"
expect: <Settings\b
expect: <SettingsRow\b
expect: <Switch\b
expect: <(Select|SegmentedControl)\b
reject: <select\b
reject: <input\b
reject: <button\b
---
Write a React component Preferences.tsx using ayywi (import from "@danitesler/ayywi/react"): the Preferences section of
an app's settings. An "Appearance" group with a theme choice (Match the system, Light, Dark) and a "Larger controls"
toggle; a "General" group with "Open at login" (on by default) and "Week starts on" (Sunday, Monday, Saturday).
Changes apply at once.
