---
file: sales.tsx
expect: LineChart|BarChart
expect: Card
expect: Chip|ChipButton
expect: sort=
reject: recharts|chart\.js|apexcharts|@nivo
reject: #[0-9a-fA-F]{3,8}\b
---
Write sales.tsx, a React component (ayywi is installed; import from "ayywi/react") for a sales page: a chart of
revenue per day for the last 30 days compared with the 30 days before, filters for the sales channel (Online,
Retail, Wholesale) above a table of the day's orders (order number, customer, channel, amount), and the amount
column sortable. Use made-up data.
