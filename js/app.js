
// GymTracker App JavaScript

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    setupEventListeners();
    showWelcomeMessage();
});

// Load user stats from localStorage
function loadStats() {
    const stats = {
        totalWorkouts: localStorage.getItem('totalWorkouts') || 0,
        totalSets: localStorage.getItem('totalSets') || 0,
        totalWeight: localStorage.getItem('totalWeight') || 0
    };
    
    // Update stats display
    document.getElementById('totalWorkouts').textContent = stats.totalWorkouts;
    document.getElementById('totalSets').textContent = stats.totalSets;
    document.getElementById('totalWeight').textContent = stats.totalWeight;
    
    // Animate counters
    animateCounters(stats);
}

// Animate stat counters
function animateCounters(stats) {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;
    
    Object.keys(stats).forEach(stat => {
        const element = document.getElementById(stat);
        const target = parseInt(stats[stat]);
        let current = 0;
        const increment = target / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, stepTime);
    });
}

// Start workout function
function startWorkout() {
    // Navigate to create workout page
    window.location.href = 'createworkout.html';
}

// Update stats after workout
function updateStats() {
    let totalWorkouts = parseInt(localStorage.getItem('totalWorkouts') || 0) + 1;
    let totalSets = parseInt(localStorage.getItem('totalSets') || 0) + Math.floor(Math.random() * 15) + 8; // 8-22 sets
    let totalWeight = parseInt(localStorage.getItem('totalWeight') || 0) + Math.floor(Math.random() * 2000) + 500; // 500-2500 lbs
    
    // Save to localStorage
    localStorage.setItem('totalWorkouts', totalWorkouts);
    localStorage.setItem('totalSets', totalSets);
    localStorage.setItem('totalWeight', totalWeight);
    
    // Update display
    document.getElementById('totalWorkouts').textContent = totalWorkouts;
    document.getElementById('totalSets').textContent = totalSets;
    document.getElementById('totalWeight').textContent = totalWeight;
}

// Complete workout
function completeWorkout() {
    showNotification('Workout completed! Great job! 💪', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        backgroundColor: type === 'success' ? '#4CAF50' : '#2196F3',
        color: 'white',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: '1001',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add click effect to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 100);
        });
    });
}

// Show welcome message
function showWelcomeMessage() {
    const isFirstVisit = !localStorage.getItem('hasVisited');
    
    if (isFirstVisit) {
        setTimeout(() => {
            showNotification('Welcome to GymTracker! Start your fitness journey today! 🎯', 'info');
            localStorage.setItem('hasVisited', 'true');
        }, 1000);
    }
}

// Reset stats function (for development/testing)
function resetStats() {
    localStorage.removeItem('totalWorkouts');
    localStorage.removeItem('totalSets');
    localStorage.removeItem('totalWeight');
    loadStats();
    showNotification('Stats reset successfully!', 'info');
}

// Export functions for potential use in other modules
window.gymTracker = {
    startWorkout,
    resetStats,
    loadStats
};
