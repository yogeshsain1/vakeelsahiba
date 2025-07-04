// Admin Dashboard JavaScript
// ==========================

class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.submissions = [];
        this.filteredSubmissions = [];
        
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.bindEvents();
        this.loadUserInfo();
        this.loadDashboardData();
    }
    
    checkAuthentication() {
        if (!window.AdminAuth || !window.AdminAuth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    bindEvents() {
        // Navigation
        document.querySelectorAll('.admin-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Filters
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('urgencyFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('serviceFilter').addEventListener('change', () => this.applyFilters());
        
        // Modal events
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('modalCancel').addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        document.getElementById('submissionModal').addEventListener('click', (e) => {
            if (e.target.id === 'submissionModal') {
                this.closeModal();
            }
        });
    }
    
    loadUserInfo() {
        const user = window.AdminAuth.getUser();
        if (user) {
            document.getElementById('currentUsername').textContent = user.username;
            const profileUsername = document.getElementById('profileUsername');
            if (profileUsername) {
                profileUsername.value = user.username;
            }
        }
    }
    
    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).parentElement.classList.add('active');
        
        // Update sections
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');
        
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            submissions: 'Contact Submissions',
            urgent: 'Urgent Cases',
            analytics: 'Analytics & Reports',
            settings: 'Settings'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        
        this.currentSection = section;
        
        // Load section-specific data
        switch (section) {
            case 'submissions':
                this.loadSubmissions();
                break;
            case 'urgent':
                this.loadUrgentCases();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }
    
    async loadDashboardData() {
        try {
            const response = await this.apiCall('get_dashboard_stats');
            if (response.success) {
                this.updateDashboardStats(response.data);
                this.loadRecentSubmissions();
                this.loadServiceStats();
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }
    
    updateDashboardStats(stats) {
        document.getElementById('totalSubmissions').textContent = stats.total || 0;
        document.getElementById('urgentCases').textContent = stats.urgent || 0;
        document.getElementById('resolvedCases').textContent = stats.resolved || 0;
        document.getElementById('todaySubmissions').textContent = stats.today || 0;
        
        // Update badges
        document.getElementById('newSubmissionsCount').textContent = stats.new || 0;
        document.getElementById('urgentCasesCount').textContent = stats.urgent || 0;
        document.getElementById('notificationCount').textContent = stats.notifications || 0;
        
        // Update change indicators
        document.getElementById('submissionsChange').textContent = `+${stats.submissionsGrowth || 0}%`;
        document.getElementById('urgentChange').textContent = stats.urgentChange || 0;
        document.getElementById('resolvedChange').textContent = `+${stats.resolvedGrowth || 0}%`;
        document.getElementById('todayChange').textContent = stats.todayChange || 0;
    }
    
    async loadRecentSubmissions() {
        try {
            const response = await this.apiCall('get_recent_submissions', { limit: 5 });
            if (response.success) {
                this.renderRecentSubmissions(response.data);
            }
        } catch (error) {
            console.error('Failed to load recent submissions:', error);
        }
    }
    
    renderRecentSubmissions(submissions) {
        const tbody = document.getElementById('recentSubmissionsBody');
        if (!submissions || submissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">No recent submissions</td></tr>';
            return;
        }
        
        tbody.innerHTML = submissions.map(submission => `
            <tr>
                <td>${this.escapeHtml(submission.name)}</td>
                <td>${this.formatService(submission.service)}</td>
                <td>${this.formatUrgencyBadge(submission.urgency)}</td>
                <td>${this.formatDate(submission.created_at)}</td>
                <td>${this.formatStatusBadge(submission.status)}</td>
                <td>
                    <button class="action-btn view" onclick="dashboard.viewSubmission(${submission.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    async loadServiceStats() {
        try {
            const response = await this.apiCall('get_service_stats');
            if (response.success) {
                this.renderServiceStats(response.data);
            }
        } catch (error) {
            console.error('Failed to load service stats:', error);
        }
    }
    
    renderServiceStats(services) {
        const container = document.getElementById('serviceStats');
        if (!services || services.length === 0) {
            container.innerHTML = '<div class="loading">No service data available</div>';
            return;
        }
        
        container.innerHTML = services.map(service => `
            <div class="service-item">
                <span class="service-name">${this.formatService(service.service)}</span>
                <span class="service-count">${service.count}</span>
            </div>
        `).join('');
    }
    
    async loadSubmissions() {
        try {
            const response = await this.apiCall('get_submissions', {
                page: this.currentPage,
                limit: this.itemsPerPage
            });
            if (response.success) {
                this.submissions = response.data;
                this.filteredSubmissions = [...this.submissions];
                this.renderSubmissions();
                this.renderPagination(response.total);
            }
        } catch (error) {
            console.error('Failed to load submissions:', error);
        }
    }
    
    renderSubmissions() {
        const tbody = document.getElementById('submissionsBody');
        if (!this.filteredSubmissions || this.filteredSubmissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="loading">No submissions found</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.filteredSubmissions.map(submission => `
            <tr>
                <td>#${submission.id}</td>
                <td>${this.escapeHtml(submission.name)}</td>
                <td>${this.escapeHtml(submission.email)}</td>
                <td>${this.escapeHtml(submission.phone || 'N/A')}</td>
                <td>${this.formatService(submission.service)}</td>
                <td>${this.formatUrgencyBadge(submission.urgency)}</td>
                <td>${this.formatDate(submission.created_at)}</td>
                <td>${this.formatStatusBadge(submission.status)}</td>
                <td>
                    <button class="action-btn view" onclick="dashboard.viewSubmission(${submission.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="dashboard.editSubmission(${submission.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    async loadUrgentCases() {
        try {
            const response = await this.apiCall('get_urgent_cases');
            if (response.success) {
                this.renderUrgentCases(response.data);
            }
        } catch (error) {
            console.error('Failed to load urgent cases:', error);
        }
    }
    
    renderUrgentCases(cases) {
        const tbody = document.getElementById('urgentBody');
        if (!cases || cases.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No urgent cases</td></tr>';
            return;
        }
        
        tbody.innerHTML = cases.map(case_ => `
            <tr>
                <td>${this.formatUrgencyBadge(case_.urgency)}</td>
                <td>${this.escapeHtml(case_.name)}</td>
                <td>
                    <div>${this.escapeHtml(case_.email)}</div>
                    <div>${this.escapeHtml(case_.phone || 'N/A')}</div>
                </td>
                <td>${this.formatService(case_.service)}</td>
                <td>${this.getHoursSince(case_.created_at)} hours</td>
                <td>${this.truncateText(case_.message, 50)}</td>
                <td>
                    <button class="action-btn view" onclick="dashboard.viewSubmission(${case_.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="dashboard.markAsContacted(${case_.id})">
                        <i class="fas fa-phone"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    applyFilters() {
        const statusFilter = document.getElementById('statusFilter').value;
        const urgencyFilter = document.getElementById('urgencyFilter').value;
        const serviceFilter = document.getElementById('serviceFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        this.filteredSubmissions = this.submissions.filter(submission => {
            const matchesStatus = !statusFilter || submission.status === statusFilter;
            const matchesUrgency = !urgencyFilter || submission.urgency === urgencyFilter;
            const matchesService = !serviceFilter || submission.service === serviceFilter;
            const matchesSearch = !searchTerm || 
                submission.name.toLowerCase().includes(searchTerm) ||
                submission.email.toLowerCase().includes(searchTerm) ||
                (submission.phone && submission.phone.includes(searchTerm));
            
            return matchesStatus && matchesUrgency && matchesService && matchesSearch;
        });
        
        this.renderSubmissions();
    }
    
    handleSearch(searchTerm) {
        this.applyFilters();
    }
    
    async viewSubmission(id) {
        try {
            const response = await this.apiCall('get_submission', { id });
            if (response.success) {
                this.showSubmissionModal(response.data);
            }
        } catch (error) {
            console.error('Failed to load submission:', error);
        }
    }
    
    showSubmissionModal(submission) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="submission-details">
                <div class="detail-group">
                    <h4>Contact Information</h4>
                    <p><strong>Name:</strong> ${this.escapeHtml(submission.name)}</p>
                    <p><strong>Email:</strong> ${this.escapeHtml(submission.email)}</p>
                    <p><strong>Phone:</strong> ${this.escapeHtml(submission.phone || 'Not provided')}</p>
                </div>
                
                <div class="detail-group">
                    <h4>Case Details</h4>
                    <p><strong>Service:</strong> ${this.formatService(submission.service)}</p>
                    <p><strong>Urgency:</strong> ${this.formatUrgencyBadge(submission.urgency)}</p>
                    <p><strong>Status:</strong> ${this.formatStatusBadge(submission.status)}</p>
                    <p><strong>Submitted:</strong> ${this.formatDateTime(submission.created_at)}</p>
                </div>
                
                <div class="detail-group">
                    <h4>Message</h4>
                    <div class="message-content">${this.escapeHtml(submission.message)}</div>
                </div>
                
                <div class="detail-group">
                    <h4>Update Status</h4>
                    <select id="modalStatus" class="admin-form-group">
                        <option value="new" ${submission.status === 'new' ? 'selected' : ''}>New</option>
                        <option value="contacted" ${submission.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="resolved" ${submission.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </div>
            </div>
        `;
        
        document.getElementById('submissionModal').classList.add('active');
        
        // Store current submission ID for saving
        this.currentSubmissionId = submission.id;
    }
    
    closeModal() {
        document.getElementById('submissionModal').classList.remove('active');
        this.currentSubmissionId = null;
    }
    
    async updateSubmissionStatus() {
        if (!this.currentSubmissionId) return;
        
        const newStatus = document.getElementById('modalStatus').value;
        
        try {
            const response = await this.apiCall('update_submission_status', {
                id: this.currentSubmissionId,
                status: newStatus
            });
            
            if (response.success) {
                this.closeModal();
                this.loadSubmissions();
                this.loadDashboardData();
                this.showNotification('Submission status updated successfully', 'success');
            } else {
                this.showNotification('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Failed to update submission status:', error);
            this.showNotification('Failed to update status', 'error');
        }
    }
    
    async markAsContacted(id) {
        try {
            const response = await this.apiCall('update_submission_status', {
                id: id,
                status: 'contacted'
            });
            
            if (response.success) {
                this.loadUrgentCases();
                this.loadDashboardData();
                this.showNotification('Marked as contacted', 'success');
            }
        } catch (error) {
            console.error('Failed to mark as contacted:', error);
        }
    }
    
    async apiCall(action, data = {}) {
        const token = window.AdminAuth.getToken();
        
        const response = await fetch('../api/admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                action: action,
                ...data
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success && result.message === 'Invalid or expired token') {
            this.logout();
            return;
        }
        
        return result;
    }
    
    logout() {
        window.AdminAuth.logout();
    }
    
    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatService(service) {
        const services = {
            'civil-disputes': 'Civil Disputes',
            'criminal-cases': 'Criminal Cases',
            'corporate-matters': 'Corporate Matters',
            'matrimonial-disputes': 'Matrimonial Disputes',
            'sarfaesi-bank': 'SARFAESI & Bank',
            'arbitration': 'Arbitration',
            'other': 'Other'
        };
        return services[service] || service;
    }
    
    formatStatusBadge(status) {
        return `<span class="status-badge ${status}">${status}</span>`;
    }
    
    formatUrgencyBadge(urgency) {
        return `<span class="urgency-badge ${urgency}">${urgency}</span>`;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
    
    getHoursSince(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now - date;
        return Math.floor(diffInMs / (1000 * 60 * 60));
    }
    
    truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
    
    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            ${type === 'success' ? 'background: #16a34a;' : 'background: #dc2626;'}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    renderPagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="dashboard.changePage(${this.currentPage - 1})">Previous</button>`;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="active">${i}</button>`;
            } else {
                paginationHTML += `<button onclick="dashboard.changePage(${i})">${i}</button>`;
            }
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="dashboard.changePage(${this.currentPage + 1})">Next</button>`;
        }
        
        pagination.innerHTML = paginationHTML;
    }
    
    changePage(page) {
        this.currentPage = page;
        this.loadSubmissions();
    }
    
    loadAnalytics() {
        // Placeholder for analytics functionality
        document.getElementById('trendsChart').innerHTML = '<div class="loading">Analytics coming soon...</div>';
        document.getElementById('serviceChart').innerHTML = '<div class="loading">Charts coming soon...</div>';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AdminDashboard();
});

// Add modal save event
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modalSave').addEventListener('click', () => {
        if (window.dashboard) {
            window.dashboard.updateSubmissionStatus();
        }
    });
});