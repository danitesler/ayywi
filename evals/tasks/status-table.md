---
file: deployments.html
expect: class="[^"]*\bayy-table\b
expect: class="[^"]*\bayy-badge\b
expect: ayy-table__num
expect: <th[^>]+scope="col"
---
Write deployments.html: a table of five recent deployments (name, branch, status, duration in seconds) styled
with ayywi. Status is shown as a coloured badge (success, building, failed). Durations are numbers.
