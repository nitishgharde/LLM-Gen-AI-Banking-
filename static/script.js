// Chat Application JavaScript
class ChatApp {
    constructor() {
        this.isLoading = false;
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.answerSection = document.getElementById('answerSection');
        this.answerContent = document.getElementById('answerContent');
        this.sourcesSection = document.getElementById('sourcesSection');
        this.sourcesList = document.getElementById('sourcesList');
        this.historyContainer = document.getElementById('historyContainer');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.toastContainer = document.getElementById('toastContainer');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHistory();
        this.updateSendButton();
    }

    setupEventListeners() {
        // Send button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input change for send button state
        this.chatInput.addEventListener('input', () => this.updateSendButton());
        
        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.chatInput.value = question;
                this.updateSendButton();
                this.sendMessage();
            });
        });
        
        // Clear history button
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });
        
        // Export history button
        document.getElementById('exportHistoryBtn').addEventListener('click', () => {
            this.exportHistory();
        });
    }

    updateSendButton() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isLoading;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isLoading) return;

        // Clear input and disable send button
        this.chatInput.value = '';
        this.updateSendButton();
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Show loading state
        this.setLoading(true);
        
        try {
            // Send request to backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Add assistant message to chat
            this.addMessage('assistant', data.answer);
            
            // Show answer in answer section
            this.showAnswer(data.answer, data.sources);
            
            // Reload history
            this.loadHistory();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.showToast('Error: ' + error.message, 'error');
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(role, content) {
        // Remove welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        const messageMeta = document.createElement('div');
        messageMeta.className = 'message-meta';
        messageMeta.textContent = role === 'user' ? 'You' : 'AI Assistant';
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageMeta);
        
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showAnswer(answer, sources) {
        this.answerContent.textContent = answer;
        this.answerSection.style.display = 'block';
        
        // Show sources if available
        if (sources && sources.length > 0) {
            this.sourcesList.innerHTML = '';
            sources.forEach(source => {
                const sourceItem = document.createElement('div');
                sourceItem.className = 'source-item';
                sourceItem.innerHTML = `
                    <div class="source-question">${source.question || 'N/A'}</div>
                    <div class="source-answer">${source.answer || 'N/A'}</div>
                `;
                this.sourcesList.appendChild(sourceItem);
            });
            this.sourcesSection.style.display = 'block';
        } else {
            this.sourcesSection.style.display = 'none';
        }
        
        // Scroll to answer section
        this.answerSection.scrollIntoView({ behavior: 'smooth' });
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.loadingOverlay.style.display = loading ? 'flex' : 'none';
        this.updateSendButton();
        
        if (loading) {
            this.statusIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Thinking...</span>';
        } else {
            this.statusIndicator.innerHTML = '<i class="fas fa-circle"></i><span>Ready</span>';
        }
    }

    async loadHistory() {
        try {
            const response = await fetch('/history');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const history = await response.json();
            this.displayHistory(history);
            
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }

    displayHistory(history) {
        if (!history || history.length === 0) {
            this.historyContainer.innerHTML = `
                <div class="history-placeholder">
                    <i class="fas fa-comments"></i>
                    <p>No conversation history yet</p>
                    <small>Start chatting to see your history here</small>
                </div>
            `;
            return;
        }
        
        this.historyContainer.innerHTML = '';
        
        history.slice(0, 10).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-question">${this.truncateText(item.question, 50)}</div>
                <div class="history-answer">${this.truncateText(item.answer, 100)}</div>
                <div class="history-timestamp">${this.formatTimestamp(item.timestamp)}</div>
            `;
            
            // Add click handler to load conversation
            historyItem.addEventListener('click', () => {
                this.chatInput.value = item.question;
                this.updateSendButton();
                this.sendMessage();
            });
            
            this.historyContainer.appendChild(historyItem);
        });
    }

    async clearHistory() {
        if (!confirm('Are you sure you want to clear all conversation history?')) {
            return;
        }
        
        try {
            const response = await fetch('/clear_history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Clear chat messages
            this.chatMessages.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-content">
                        <i class="fas fa-robot"></i>
                        <h3>Welcome to Smart Bank Assistant!</h3>
                        <p>I'm here to help you with all your banking questions. You can ask me about:</p>
                        <ul>
                            <li>Account services and features</li>
                            <li>Transaction procedures</li>
                            <li>Banking policies and fees</li>
                            <li>Online banking support</li>
                        </ul>
                        <p>Try asking me something or use the quick actions above!</p>
                    </div>
                </div>
            `;
            
            // Clear answer section
            this.answerSection.style.display = 'none';
            
            // Reload history
            this.loadHistory();
            
            this.showToast('Conversation history cleared successfully!', 'success');
            
        } catch (error) {
            console.error('Error clearing history:', error);
            this.showToast('Error clearing history: ' + error.message, 'error');
        }
    }

    async exportHistory() {
        try {
            const response = await fetch('/export_history');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const history = await response.json();
            
            if (!history || history.length === 0) {
                this.showToast('No conversation history to export', 'warning');
                return;
            }
            
            // Create and download JSON file
            const dataStr = JSON.stringify(history, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `conversation_history_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showToast('Conversation history exported successfully!', 'success');
            
        } catch (error) {
            console.error('Error exporting history:', error);
            this.showToast('Error exporting history: ' + error.message, 'error');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }
}

// Initialize the chat application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

// Handle page visibility change to refresh history when user returns
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible again, refresh history
        const chatApp = window.chatApp;
        if (chatApp) {
            chatApp.loadHistory();
        }
    }
});
