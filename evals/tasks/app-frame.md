---
file: app.html
expect: class="[^"]*\bayy-app-shell\b
expect: class="[^"]*\bayy-app-shell__sidebar\b
expect: class="[^"]*\bayy-bottom-nav\b
expect: aria-current="page"
expect: class="[^"]*\bayy-page-header\b
expect: <h1
reject: class="[^"]*\bayy-navbar\b
reject: @media
---
Write app.html: the home screen of a project-management app, in plain HTML with ayywi (CSS at
node_modules/@danitesler/ayywi/dist/ayywi.min.css, script at node_modules/@danitesler/ayywi/dist/elements.global.js). Five destinations:
Home, Projects, Inbox, Reports, Settings. On a laptop they're in a sidebar; on a phone they must be one thumb-tap
away at the bottom of the screen. The Home page has a title, one line about it and a "New project" button.
