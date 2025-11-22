// API base URL
const API_URL = '/api/tasks';

// DOM elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close');
const tasksList = document.getElementById('tasksList');
const modalTitle = document.getElementById('modalTitle');
const sortBy = document.getElementById('sortBy');

let tasks = [];
let editingTaskId = null;

// Event listeners
addTaskBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', () => closeModal());
cancelBtn.addEventListener('click', () => closeModal());
taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) closeModal();
});

taskForm.addEventListener('submit', handleSubmit);
sortBy.addEventListener('change', () => renderTasks());

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Functions
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasksList.innerHTML = '<div class="empty-state"><h3>Error loading tasks</h3></div>';
    }
}

function renderTasks() {
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet</h3>
                <p>Click "Add New Task" to get started!</p>
            </div>
        `;
        return;
    }

    // Get selected sort option
    const sortOption = sortBy.value;
    let sortedTasks = [...tasks];

    // Apply sorting based on selected option
    switch (sortOption) {
        case 'due-date-asc':
            sortedTasks.sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                if (!a.due_date && !b.due_date) return 0;
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(a.due_date) - new Date(b.due_date);
            });
            break;
        
        case 'due-date-desc':
            sortedTasks.sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                if (!a.due_date && !b.due_date) return 0;
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(b.due_date) - new Date(a.due_date);
            });
            break;
        
        case 'priority-asc':
            sortedTasks.sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                const priorityOrder = { urgent: 3, important: 2, normal: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
            break;
        
        case 'priority-desc':
            sortedTasks.sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                const priorityOrder = { urgent: 3, important: 2, normal: 1 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
        
        case 'default':
        default:
            // Default: incomplete first, then by priority, then by due date
            sortedTasks.sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                if (a.completed) return 0;
                
                const priorityOrder = { urgent: 3, important: 2, normal: 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                
                if (a.due_date && b.due_date) {
                    return new Date(a.due_date) - new Date(b.due_date);
                }
                if (a.due_date) return -1;
                if (b.due_date) return 1;
                return 0;
            });
            break;
    }

    tasksList.innerHTML = sortedTasks.map(task => createTaskCard(task)).join('');
    
    // Add event listeners to all task cards
    sortedTasks.forEach(task => {
        const checkbox = document.getElementById(`checkbox-${task.id}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => toggleComplete(task.id));
        }
        
        const editBtn = document.getElementById(`edit-${task.id}`);
        if (editBtn) {
            editBtn.addEventListener('click', () => editTask(task.id));
        }
        
        const deleteBtn = document.getElementById(`delete-${task.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        }
    });
}

function createTaskCard(task) {
    return `
        <div class="task-card ${task.completed ? 'completed' : ''}">
            <div class="task-row">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-icons">
                    <input type="checkbox" class="task-checkbox" id="checkbox-${task.id}" ${task.completed ? 'checked' : ''} title="Mark as done">
                    <button class="icon-btn edit-icon" id="edit-${task.id}" title="Edit">✏️</button>
                    <button class="icon-btn delete-icon" id="delete-${task.id}" title="Delete">🗑️</button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        </div>
    `;
}

function openModal(taskId = null) {
    editingTaskId = taskId;
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            modalTitle.textContent = 'Edit Task';
            document.getElementById('taskId').value = task.id;
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description || '';
            document.getElementById('dueDate').value = task.due_date || '';
            document.getElementById('priority').value = task.priority;
        }
    } else {
        modalTitle.textContent = 'Add New Task';
        taskForm.reset();
        document.getElementById('taskId').value = '';
    }
    taskModal.style.display = 'block';
}

function closeModal() {
    taskModal.style.display = 'none';
    taskForm.reset();
    editingTaskId = null;
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        due_date: document.getElementById('dueDate').value || null,
        priority: document.getElementById('priority').value
    };
    
    if (!formData.title) {
        alert('Title is required!');
        return;
    }
    
    try {
        if (editingTaskId) {
            // Update existing task
            const task = tasks.find(t => t.id === editingTaskId);
            await fetch(`${API_URL}/${editingTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, ...formData })
            });
        } else {
            // Create new task
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        closeModal();
        await loadTasks();
    } catch (error) {
        console.error('Error saving task:', error);
        alert('Error saving task. Please try again.');
    }
}

async function toggleComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, completed: !task.completed })
        });
        await loadTasks();
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Error updating task. Please try again.');
    }
}

function editTask(taskId) {
    openModal(taskId);
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
        await loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Please try again.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

