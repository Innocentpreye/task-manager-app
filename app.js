/**
 * InnTrack - Personal Finance Dashboard
 * Vanilla JS logic for handling transactions, UI updates, and local storage.
 */

// App State
let transactions = [];
let chartInstance = null;

// DOM Elements
const form = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expensesEl = document.getElementById('total-expenses');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');

// Initialize App
function init() {
    // Load from local storage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    } else {
        // Add some dummy data if empty
        transactions = [
            { id: generateId(), type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary', date: new Date().toISOString() },
            { id: generateId(), type: 'expense', amount: 1200, category: 'Rent', description: 'Apartment Rent', date: new Date().toISOString() },
            { id: generateId(), type: 'expense', amount: 150, category: 'Utilities', description: 'Electric Bill', date: new Date().toISOString() },
        ];
        saveToLocalStorage();
    }

    // Event Listeners
    form.addEventListener('submit', addTransaction);
    searchInput.addEventListener('input', render);
    filterCategory.addEventListener('change', render);

    // Initial render
    render();
}

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

// Add Transaction
function addTransaction(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();

    if (!description || isNaN(amount) || amount <= 0) {
        alert('Please enter valid details');
        return;
    }

    const transaction = {
        id: generateId(),
        type,
        amount,
        category,
        description,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    saveToLocalStorage();
    
    // Reset form
    form.reset();
    
    // Update UI
    render();
}

// Delete Transaction
function deleteTransaction(id) {
    if(confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        render();
    }
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Render UI
function render() {
    updateKPIs();
    renderTransactionsList();
    updateChart();
}

// Update KPI Cards
function updateKPIs() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
        
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
        
    const balance = income - expense;

    balanceEl.innerText = formatCurrency(balance);
    incomeEl.innerText = formatCurrency(income);
    expensesEl.innerText = formatCurrency(expense);
}

// Render Transactions Table
function renderTransactionsList() {
    transactionsList.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterCategory.value;

    // Filter transactions
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">No transactions found</td>
            </tr>
        `;
        return;
    }

    filteredTransactions.forEach(t => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${formatDate(t.date)}</td>
            <td><strong>${t.description}</strong></td>
            <td>${t.category}</td>
            <td><span class="badge badge-${t.type}">${t.type}</span></td>
            <td style="color: ${t.type === 'income' ? 'var(--success-color)' : 'var(--danger-color)'}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </td>
            <td>
                <button class="btn-delete" onclick="deleteTransaction('${t.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        
        transactionsList.appendChild(tr);
    });
}

// Update Chart.js
function updateChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    // Aggregate expenses by category
    const expenseCategories = {};
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(t => {
        if (t.type === 'expense') {
            totalExpense += t.amount;
            if (expenseCategories[t.category]) {
                expenseCategories[t.category] += t.amount;
            } else {
                expenseCategories[t.category] = t.amount;
            }
        } else {
            totalIncome += t.amount;
        }
    });

    // If chart exists, destroy it before re-rendering
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Chart Data
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    '#10b981', // success-color
                    '#ef4444'  // danger-color
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8fafc',
                        padding: 20,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Start app
document.addEventListener('DOMContentLoaded', init);