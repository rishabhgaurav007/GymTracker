
// Create Workout Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupFormHandlers();
});

// Setup form event handlers
function setupFormHandlers() {
    const form = document.getElementById('workoutForm');
    form.addEventListener('submit', handleWorkoutSubmission);
}

// Handle workout form submission
function handleWorkoutSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const workoutData = {
        name: formData.get('workoutName'),
        type: formData.get('workoutType'),
        exercises: collectExercises(),
        createdAt: new Date().toISOString()
    };
    
    // Save workout to localStorage
    saveWorkout(workoutData);
    
    // Show success message
    showNotification('Workout created successfully! 🎉', 'success');
    
    // Redirect back to home after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Collect exercises from form
function collectExercises() {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    const exercises = [];
    
    exerciseItems.forEach(item => {
        const name = item.querySelector('.exercise-name').value;
        const sets = item.querySelector('.exercise-sets').value;
        const reps = item.querySelector('.exercise-reps').value;
        const weight = item.querySelector('.exercise-weight').value;
        
        if (name && sets && reps) {
            exercises.push({
                name: name.trim(),
                sets: parseInt(sets),
                reps: parseInt(reps),
                weight: weight ? parseFloat(weight) : 0
            });
        }
    });
    
    return exercises;
}

// Save workout to localStorage
function saveWorkout(workoutData) {
    let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    workouts.push(workoutData);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    
    // Update stats
    updateWorkoutStats(workoutData);
}

// Update workout statistics
function updateWorkoutStats(workoutData) {
    let totalWorkouts = parseInt(localStorage.getItem('totalWorkouts') || '0') + 1;
    let totalSets = parseInt(localStorage.getItem('totalSets') || '0');
    let totalWeight = parseInt(localStorage.getItem('totalWeight') || '0');
    
    // Calculate totals from exercises
    workoutData.exercises.forEach(exercise => {
        totalSets += exercise.sets;
        totalWeight += (exercise.weight * exercise.sets * exercise.reps);
    });
    
    // Save updated stats
    localStorage.setItem('totalWorkouts', totalWorkouts);
    localStorage.setItem('totalSets', totalSets);
    localStorage.setItem('totalWeight', totalWeight);
}

// Add new exercise input row
function addExercise() {
    const exerciseList = document.getElementById('exerciseList');
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'exercise-item';
    
    exerciseItem.innerHTML = `
        <input type="text" placeholder="Exercise name" class="exercise-name" required>
        <input type="number" placeholder="Sets" class="exercise-sets" min="1" required>
        <input type="number" placeholder="Reps" class="exercise-reps" min="1" required>
        <input type="number" placeholder="Weight (lbs)" class="exercise-weight" min="0" step="0.5">
        <button type="button" class="remove-exercise" onclick="removeExercise(this)">×</button>
    `;
    
    exerciseList.appendChild(exerciseItem);
}

// Remove exercise input row
function removeExercise(button) {
    const exerciseItem = button.parentElement;
    const exerciseList = document.getElementById('exerciseList');
    
    // Don't remove if it's the only exercise
    if (exerciseList.children.length > 1) {
        exerciseItem.remove();
    } else {
        showNotification('At least one exercise is required', 'info');
    }
}

// Go back to home page
function goBack() {
    window.location.href = 'index.html';
}

// Show notification (reuse from main app)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        backgroundColor: type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : '#ff6b6b',
        color: 'white',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: '1001',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
