// State Management
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const errorMessage = document.getElementById('errorMessage');
const taskList = document.getElementById('taskList');
const totalCount = document.getElementById('totalCount');
const remainingCount = document.getElementById('remainingCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterGroup = document.querySelector('.filter-group');

// 1. Add Task Form Handling (Validation)
todoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = taskInput.value.trim();

  // Validate empty input
  if (!text) {
    showError('Task cannot be empty.');
    return;
  }

  // Validate duplicate task (case-insensitive)
  const isDuplicate = tasks.some(
    task => task.text.toLowerCase() === text.toLowerCase()
  );

  if (isDuplicate) {
    showError('This task already exists in your list.');
    return;
  }

  // Clear errors if valid
  clearError();

  // Create new task object
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';
  render();
});

// Helper functions for error messaging
function showError(msg) {
  errorMessage.textContent = msg;
}

function clearError() {
  errorMessage.textContent = '';
}

// Clear error message when user starts typing again
taskInput.addEventListener('input', clearError);

// 2. Event Delegation on Task List Container
taskList.addEventListener('click', function (e) {
  const target = e.target;
  const taskItem = target.closest('.task-item');

  if (!taskItem) return;

  const taskId = Number(taskItem.dataset.id);

  // Toggle Completion
  if (target.classList.contains('task-checkbox')) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = target.checked;
      render();
    }
  }

  // Delete Task
  if (target.classList.contains('delete-btn')) {
    tasks = tasks.filter(t => t.id !== taskId);
    render();
  }
});

// Double click event delegation for inline edit
taskList.addEventListener('dblclick', function (e) {
  if (e.target.classList.contains('task-text')) {
    const taskItem = e.target.closest('.task-item');
    const taskId = Number(taskItem.dataset.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    // Replace text span with input field
    const textSpan = e.target;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;

    textSpan.replaceWith(input);
    input.focus();

    // Save on Enter, cancel on Esc or blur
    function saveEdit() {
      const newText = input.value.trim();
      if (newText && !tasks.some(t => t.id !== taskId && t.text.toLowerCase() === newText.toLowerCase())) {
        task.text = newText;
      }
      render();
    }

    input.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        saveEdit();
      } else if (evt.key === 'Escape') {
        render();
      }
    });

    input.addEventListener('blur', saveEdit);
  }
});

// 3. Filter Buttons Handler
filterGroup.addEventListener('click', function (e) {
  if (e.target.classList.contains('filter-btn')) {
    // Update active UI tab
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Update filter state
    currentFilter = e.target.dataset.filter;
    render();
  }
});

// 4. Clear Completed Tasks Handler
clearCompletedBtn.addEventListener('click', function () {
  tasks = tasks.filter(t => !t.completed);
  render();
});

// 5. Render Function (UI Sync & Counters)
function render() {
  // Clear list
  taskList.innerHTML = '';

  // Filter tasks based on current tab
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Render filtered list items
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-content">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''}
        >
        <span class="task-text">${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);
  });

  // Update Counters
  const total = tasks.length;
  const remaining = tasks.filter(t => !t.completed).length;

  totalCount.textContent = total;
  remainingCount.textContent = remaining;
}

// Security Helper to avoid XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Initial Render
render();