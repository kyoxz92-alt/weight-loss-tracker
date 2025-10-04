// Weight Loss Exercise Tracker Application

class ExerciseTracker {
    constructor() {
        // Exercise program data
        this.weeklyPrograms = {
            "week1-2": {
                "name": "Beginner Level (Week 1-2)",
                "cardio": [
                    {"name": "Walking", "duration": "20-30 minutes", "sets": 1, "reps": null},
                    {"name": "Jumping Jacks", "duration": null, "sets": 2, "reps": 15},
                    {"name": "High Knees", "duration": "30 seconds", "sets": 2, "reps": null},
                    {"name": "Mountain Climbers", "duration": null, "sets": 2, "reps": 15}
                ],
                "strength": [
                    {"name": "Bodyweight Squats", "duration": null, "sets": 3, "reps": "10-15"},
                    {"name": "Wall Push-ups", "duration": null, "sets": 3, "reps": "8-12"},
                    {"name": "Lunges", "duration": null, "sets": 2, "reps": "10 per leg"},
                    {"name": "Plank", "duration": "15-30 seconds", "sets": 1, "reps": null}
                ]
            },
            "week3-4": {
                "name": "Intermediate Level (Week 3-4)",
                "cardio": [
                    {"name": "Brisk Walking/Light Jogging", "duration": "25-35 minutes", "sets": 1, "reps": null},
                    {"name": "Burpees", "duration": null, "sets": 3, "reps": 8},
                    {"name": "Jumping Jacks", "duration": null, "sets": 3, "reps": 20},
                    {"name": "Skipping/Jump Rope", "duration": "30 seconds", "sets": 3, "reps": null},
                    {"name": "Box Steps", "duration": null, "sets": 2, "reps": "15 per leg"}
                ],
                "strength": [
                    {"name": "Squats", "duration": null, "sets": 3, "reps": "15-20"},
                    {"name": "Push-ups", "duration": null, "sets": 3, "reps": "10-15"},
                    {"name": "Lunges", "duration": null, "sets": 3, "reps": "12 per leg"},
                    {"name": "Plank", "duration": "45-60 seconds", "sets": 1, "reps": null},
                    {"name": "Bridge", "duration": null, "sets": 3, "reps": 15}
                ]
            }
        };

        this.motivationalMessages = [
            "Great job! Keep up the momentum!",
            "You're crushing it today!",
            "Every rep counts towards your goal!",
            "Consistency is key - you've got this!",
            "Amazing progress! Your future self will thank you!",
            "You're stronger than you think!",
            "One step closer to your fitness goals!"
        ];

        // Application state
        this.currentWeek = 'week1-2';
        this.completedExercises = new Set();
        this.currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.renderExercises();
        this.updateProgress();
    }

    setupEventListeners() {
        // Week selector
        const weekSelect = document.getElementById('weekSelect');
        weekSelect.addEventListener('change', (e) => {
            this.changeWeek(e.target.value);
        });

        // Reset button
        const resetButton = document.getElementById('resetButton');
        resetButton.addEventListener('click', () => {
            this.resetProgress();
        });

        // Complete all button (demo)
        const completeAllButton = document.getElementById('completeAllButton');
        completeAllButton.addEventListener('click', () => {
            this.completeAllExercises();
        });

        // Modal close button
        const closeModalButton = document.getElementById('closeModalButton');
        closeModalButton.addEventListener('click', () => {
            this.closeCompletionModal();
        });

        // Modal overlay click to close
        const modalOverlay = document.querySelector('.modal-overlay');
        modalOverlay.addEventListener('click', () => {
            this.closeCompletionModal();
        });
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        dateElement.textContent = this.currentDate;
    }

    changeWeek(weekKey) {
        this.currentWeek = weekKey;
        this.completedExercises.clear();
        
        // Update week title
        const weekTitle = document.getElementById('currentWeekTitle');
        weekTitle.textContent = this.weeklyPrograms[weekKey].name;
        
        this.renderExercises();
        this.updateProgress();
    }

    renderExercises() {
        const program = this.weeklyPrograms[this.currentWeek];
        
        this.renderExerciseCategory('cardio', program.cardio);
        this.renderExerciseCategory('strength', program.strength);
    }

    renderExerciseCategory(category, exercises) {
        const container = document.getElementById(`${category}Exercises`);
        container.innerHTML = '';

        exercises.forEach((exercise, index) => {
            const exerciseId = `${category}-${index}`;
            const exerciseElement = this.createExerciseElement(exercise, exerciseId);
            container.appendChild(exerciseElement);
        });
    }

    createExerciseElement(exercise, exerciseId) {
        const isCompleted = this.completedExercises.has(exerciseId);
        
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = `exercise-item ${isCompleted ? 'completed' : ''}`;
        
        exerciseDiv.innerHTML = `
            <div class="exercise-checkbox ${isCompleted ? 'checked' : ''}" 
                 data-exercise-id="${exerciseId}" 
                 role="checkbox" 
                 aria-checked="${isCompleted}"
                 tabindex="0">
            </div>
            <div class="exercise-details">
                <h4 class="exercise-name">${exercise.name}</h4>
                <div class="exercise-specs">
                    ${this.generateExerciseSpecs(exercise)}
                </div>
            </div>
        `;

        // Add event listeners
        const checkbox = exerciseDiv.querySelector('.exercise-checkbox');
        checkbox.addEventListener('click', () => {
            this.toggleExercise(exerciseId, exerciseDiv, checkbox);
        });

        checkbox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleExercise(exerciseId, exerciseDiv, checkbox);
            }
        });

        return exerciseDiv;
    }

    generateExerciseSpecs(exercise) {
        const specs = [];
        
        if (exercise.sets && exercise.sets > 1) {
            specs.push(`<span class="exercise-spec">${exercise.sets} sets</span>`);
        }
        
        if (exercise.reps) {
            specs.push(`<span class="exercise-spec">${exercise.reps} reps</span>`);
        }
        
        if (exercise.duration) {
            specs.push(`<span class="exercise-spec">${exercise.duration}</span>`);
        }

        return specs.join('');
    }

    toggleExercise(exerciseId, exerciseElement, checkbox) {
        const wasCompleted = this.completedExercises.has(exerciseId);
        
        if (wasCompleted) {
            this.completedExercises.delete(exerciseId);
            exerciseElement.classList.remove('completed');
            checkbox.classList.remove('checked');
            checkbox.setAttribute('aria-checked', 'false');
        } else {
            this.completedExercises.add(exerciseId);
            exerciseElement.classList.add('completed');
            checkbox.classList.add('checked');
            checkbox.setAttribute('aria-checked', 'true');
        }

        this.updateProgress();
        this.checkForCompletion();
    }

    updateProgress() {
        const program = this.weeklyPrograms[this.currentWeek];
        const totalExercises = program.cardio.length + program.strength.length;
        const completedCount = this.completedExercises.size;
        const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

        // Update overall progress
        const progressFill = document.getElementById('dailyProgress');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedCount} of ${totalExercises} completed`;

        // Update category progress
        this.updateCategoryProgress('cardio', program.cardio.length);
        this.updateCategoryProgress('strength', program.strength.length);

        // Update motivational message
        this.updateMotivationalMessage(progressPercentage, completedCount);
    }

    updateCategoryProgress(category, totalInCategory) {
        const completedInCategory = Array.from(this.completedExercises)
            .filter(id => id.startsWith(category)).length;
        
        const progressElement = document.getElementById(`${category}Progress`);
        progressElement.textContent = `${completedInCategory}/${totalInCategory}`;
        
        if (completedInCategory === totalInCategory && totalInCategory > 0) {
            progressElement.classList.add('complete');
        } else {
            progressElement.classList.remove('complete');
        }
    }

    updateMotivationalMessage(progressPercentage, completedCount) {
        const messageElement = document.getElementById('motivationalMessage');
        
        if (completedCount === 0) {
            messageElement.textContent = "Ready to start your fitness journey!";
        } else if (progressPercentage === 100) {
            messageElement.textContent = "🎉 Outstanding! You've completed all exercises today!";
        } else if (progressPercentage >= 75) {
            messageElement.textContent = "Almost there! Just a few more exercises to go!";
        } else if (progressPercentage >= 50) {
            messageElement.textContent = "Halfway done! You're doing great!";
        } else if (progressPercentage >= 25) {
            messageElement.textContent = "Good start! Keep the momentum going!";
        } else {
            const randomMessage = this.motivationalMessages[
                Math.floor(Math.random() * this.motivationalMessages.length)
            ];
            messageElement.textContent = randomMessage;
        }
    }

    checkForCompletion() {
        const program = this.weeklyPrograms[this.currentWeek];
        const totalExercises = program.cardio.length + program.strength.length;
        
        if (this.completedExercises.size === totalExercises && totalExercises > 0) {
            setTimeout(() => {
                this.showCompletionModal();
            }, 500);
        }
    }

    showCompletionModal() {
        const modal = document.getElementById('completionModal');
        const completionMessage = document.getElementById('completionMessage');
        
        const congratsMessages = [
            "You've completed all your exercises for today! Your dedication is inspiring!",
            "Fantastic work! Every exercise brings you closer to your fitness goals!",
            "Amazing job today! You're building strength and endurance with each workout!",
            "Way to go! Consistency like this is what transforms lives!"
        ];
        
        const randomMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
        completionMessage.textContent = randomMessage;
        
        modal.classList.remove('hidden');
    }

    closeCompletionModal() {
        const modal = document.getElementById('completionModal');
        modal.classList.add('hidden');
    }

    resetProgress() {
        this.completedExercises.clear();
        
        // Remove completed states from UI
        const exerciseItems = document.querySelectorAll('.exercise-item');
        exerciseItems.forEach(item => {
            item.classList.remove('completed');
            const checkbox = item.querySelector('.exercise-checkbox');
            checkbox.classList.remove('checked');
            checkbox.setAttribute('aria-checked', 'false');
        });
        
        this.updateProgress();
        
        // Show feedback
        const messageElement = document.getElementById('motivationalMessage');
        const originalMessage = messageElement.textContent;
        messageElement.textContent = "Progress reset! Ready for a fresh start!";
        
        setTimeout(() => {
            this.updateMotivationalMessage(0, 0);
        }, 2000);
    }

    completeAllExercises() {
        const program = this.weeklyPrograms[this.currentWeek];
        const allExerciseIds = [];
        
        // Generate all exercise IDs
        program.cardio.forEach((_, index) => {
            allExerciseIds.push(`cardio-${index}`);
        });
        
        program.strength.forEach((_, index) => {
            allExerciseIds.push(`strength-${index}`);
        });
        
        // Add all to completed set
        allExerciseIds.forEach(id => this.completedExercises.add(id));
        
        // Update UI with animation
        const exerciseItems = document.querySelectorAll('.exercise-item');
        exerciseItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('completed');
                const checkbox = item.querySelector('.exercise-checkbox');
                checkbox.classList.add('checked');
                checkbox.setAttribute('aria-checked', 'true');
            }, index * 100);
        });
        
        // Update progress after animations
        setTimeout(() => {
            this.updateProgress();
            this.checkForCompletion();
        }, exerciseItems.length * 100 + 200);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExerciseTracker();
});

// Add some keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('completionModal');
        if (!modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    }
});