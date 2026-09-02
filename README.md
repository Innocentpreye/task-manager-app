What it does

InnTrack provides a lightweight finance-tracking experience without requiring an account, backend, or database.

Users can:

•
Add income and expense transactions.

•
Assign each transaction a category and description.

•
View total balance, total income, and total expenses.

•
Search transaction descriptions.

•
Filter transactions by category.

•
Review transactions in a date-sorted table.

•
Delete transactions from the history.

•
View an income-versus-expenses doughnut chart.

•
Keep transactions in the browser using localStorage.

The main product flow

1.
The user opens the dashboard and sees the current financial summary.

2.
The user adds an income or expense with an amount, category, and description.

3.
The application validates the entry and stores it in browser storage.

4.
The KPI cards, transaction table, and chart update from the same transaction state.

5.
The user can search, filter, review, or delete transactions without leaving the dashboard.

Technical implementation

The project uses a deliberately small front-end stack:

•
HTML5 for the dashboard structure, form controls, navigation, KPI cards, table, and chart container.

•
CSS3 for the dark interface, responsive layout, cards, forms, table styling, spacing, colors, and mobile breakpoints.

•
Vanilla JavaScript for application state, form handling, validation, transaction calculations, filtering, sorting, deletion, and local persistence.

•
Chart.js for the income-versus-expenses visualization.

•
Browser localStorage for saving transactions between sessions on the same device and browser.

•
Font Awesome and Google Fonts for interface icons and typography.

Dashboard sections

Financial summary

The dashboard calculates and displays total balance, total income, and total expenses from the transaction list.

Add Transaction

The transaction form accepts the type, amount, category, and description. Amounts must be greater than zero and descriptions are required before a transaction is saved.

Transaction history

Transactions are rendered in a table with date, description, category, type, amount, and delete action. The list is sorted with the newest transaction first.

Search and filtering

The transaction history can be searched by description and filtered by category. Both controls update the rendered list without a page reload.

Visualization

A Chart.js doughnut chart compares the total income and total expenses currently stored in the application.

Run locally

This is a static web application. No package installation, backend, database, or environment variables are required for the current implementation.

Clone the repository:

Bash


git clone https://github.com/Innocentpreye/task-manager-app.git
cd task-manager-app



Open index.html directly in a browser, or serve the folder locally:

Bash


python3 -m http.server 8000



Then visit:

Plain Text


http://localhost:8000



The application loads Chart.js, Font Awesome, and Google Fonts from their public CDNs, so an internet connection is required for those external assets.

Project structure

Plain Text


task-manager-app/
├── index.html    # Dashboard markup, form, table, and chart container
├── app.js        # State, calculations, storage, filtering, and rendering
├── styles.css    # Theme, layout, responsive styles, and components
└── .replit       # Replit project configuration



Current scope

InnTrack is currently a client-side dashboard prototype. Transactions are stored only in the browser where they are created. There is no authentication, cloud synchronization, server-side database, multi-user access, bank connection, or financial institution integration.

Those limitations are intentional boundaries of the current version, not hidden features. A production version could add authenticated accounts, a server-side database, transaction import, stronger validation, accessibility testing, export formats, and encrypted data handling.

What this project demonstrates

This project demonstrates the complete front-end loop for a small data-driven dashboard: collecting structured input, validating it, storing state, calculating derived values, rendering a table, filtering and sorting records, and updating a chart from the same source of truth.

It is a useful foundation for extending dashboards, admin panels, internal tools, and SaaS interfaces where reliable state handling and clear information display matter more than a large framework.

Author

Built by Innocent Iganran.

