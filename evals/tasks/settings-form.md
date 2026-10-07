---
file: settings.html
expect: class="[^"]*\bayy-field\b
expect: class="[^"]*\bayy-switch\b
expect: role="switch"
expect: <label[^>]+for=
expect: class="[^"]*\bayy-button\b
---
Build a plain HTML settings page (settings.html) for a project using the ayywi design system that is already
installed (CSS at node_modules/@danitesler/ayywi/dist/ayywi.min.css). It needs: a project name text field with a hint,
two on/off settings ("Deploy previews", "Email alerts"), and Save / Cancel buttons. No other CSS framework.
