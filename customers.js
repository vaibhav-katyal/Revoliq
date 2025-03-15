// Sample customer data (replace with actual API calls)
const customers = [
    {
        id: 'CUST001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        totalVisits: 15,
        lastVisit: '2024-03-10',
        status: 'active'
    },
    {
        id: 'CUST002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        totalVisits: 8,
        lastVisit: '2024-03-08',
        status: 'active'
    },
    {
        id: 'CUST003',
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        totalVisits: 3,
        lastVisit: '2024-02-28',
        status: 'inactive'
    },
    {
        id: 'CUST004',
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        totalVisits: 12,
        lastVisit: '2024-03-09',
        status: 'active'
    },
    {
        id: 'CUST005',
        name: 'Robert Brown',
        email: 'robert.b@example.com',
        totalVisits: 6,
        lastVisit: '2024-03-05',
        status: 'active'
    }
];

// Populate customers table
function populateCustomersTable(customersData) {
    const tableBody = document.getElementById('customersTableBody');
    tableBody.innerHTML = customersData.map(customer => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.totalVisits}</td>
            <td>${formatDate(customer.lastVisit)}</td>
            <td>
                <span class="status-badge ${customer.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
            </td>
            <td class="customer-actions">
                <button class="action-btn edit-btn" onclick="editCustomer('${customer.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteCustomer('${customer.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Search functionality
document.getElementById('searchCustomers').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.id.toLowerCase().includes(searchTerm)
    );
    populateCustomersTable(filteredCustomers);
});

// Modal functions
const modal = document.getElementById('customerModal');
let currentCustomerId = null;

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    currentCustomerId = null;
    document.getElementById('customerForm').reset();
}

// Edit customer
function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        currentCustomerId = customerId;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone || '';
        openModal();
    }
}

// Delete customer
function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        const index = customers.findIndex(c => c.id === customerId);
        if (index !== -1) {
            customers.splice(index, 1);
            populateCustomersTable(customers);
        }
    }
}

// Handle form submission
document.getElementById('customerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (currentCustomerId) {
        const customerIndex = customers.findIndex(c => c.id === currentCustomerId);
        if (customerIndex !== -1) {
            customers[customerIndex] = {
                ...customers[customerIndex],
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                phone: document.getElementById('customerPhone').value
            };
            populateCustomersTable(customers);
            closeModal();
        }
    }
});

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
};

// Initialize table
populateCustomersTable(customers);