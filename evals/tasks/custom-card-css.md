---
file: pricing.css
expect: var\(--ayy-
reject: #[0-9a-fA-F]{3,8}\b
reject: \b(margin|padding)-(left|right)\b
---
Write pricing.css for a pricing card that sits on top of ayywi's .ayy-card: a highlighted "Popular" plan with an
accent border, a large price, and a list of features with a gap between items. Use ayywi tokens, and make it work
in both light and dark themes and in right-to-left languages.
