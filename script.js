// Quotes Array
const quotesArray = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The way to get started is to quit talking and begin doing.",
  "Don't watch the clock; do what it does. Keep going.",
  "You don't have to be great to start, but you have to start to be great.",
  "The best time to plant a tree was 20 years ago. The second-best time is now.",
  "It’s not whether you get knocked down, it’s whether you get up.",
  "The only way to achieve the impossible is to believe it is possible.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "Opportunities don't happen, you create them."
];

// History Array to store task actions
let history = [];

// Function to get a random quote
function getRandomQuote() {
  return quotesArray[Math.floor(Math.random() * quotesArray.length)];
}

// Function to validate task date and time (not in the past)
function isTaskDateTimeValid(taskDate, taskTime) {
  const currentDateTime = new Date(); // Current date and time
  const taskDateTime = new Date(`${taskDate}T${taskTime}`); // Task date and time
  return taskDateTime > currentDateTime;
}

// Function to validate task text (no special characters)
function isTaskTextValid(taskText) {
  const regex = /^[a-zA-Z0-9\s.,!?]+$/; // Allow alphanumeric, spaces, and basic punctuation
  return regex.test(taskText);
}

// Function to add a task
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskTime = document.getElementById('taskTime');
  const taskCategory = document.getElementById('taskCategory');

  // Validate task text (no special characters)
  if (!isTaskTextValid(taskInput.value.trim())) {
    alert('Task text should not contain special characters.');
    return;
  }

  // Validate task date and time (not in the past)
  if (!isTaskDateTimeValid(taskDate.value, taskTime.value)) {
    alert('Task date and time must be in the future.');
    return;
  }

  // Create task object
  const task = {
    text: taskInput.value.trim(),
    date: taskDate.value,
    time: taskTime.value,
    category: taskCategory.value,
    quote: getRandomQuote(),
  };

  // Log the "Added" action to history
  history.push({
    action: "Added",
    task: task,
    timestamp: new Date().toLocaleString(),
  });

  // Schedule notification for the task
  scheduleNotification(task);

  // Create task item and add it to the DOM
  const taskItem = document.createElement('li');
  taskItem.innerHTML = `
      <span>${task.text} - ${task.date} ${task.time} (${task.category})</span>
      <div class="quote">${task.quote}</div>
      <textarea class="sticky-note" placeholder="Add a note..."></textarea>
      <div class="task-actions">
          <button class="complete-btn" onclick="completeTask(this)">Complete</button>
          <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
      </div>
  `;
  document.getElementById('tasks').appendChild(taskItem);

  // Show in-app notification
  showInAppNotification("Task added successfully!");

  // Store task in local storage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Clear input fields
  taskInput.value = '';
  taskDate.value = '';
  taskTime.value = '';
  taskCategory.value = 'work';
}

// Function to complete a task
function completeTask(button) {
  const taskItem = button.closest('li');
  const taskText = taskItem.querySelector('span').textContent.split(' - ')[0].trim();

  // Log the "Completed" action to history
  history.push({
    action: "Completed",
    task: { text: taskText },
    timestamp: new Date().toLocaleString(),
  });

  // Toggle "done" class for visual indication
  taskItem.classList.toggle('done');

  // Update local storage
  updateLocalStorage();
}

// Function to delete a task
function deleteTask(button) {
  const taskItem = button.closest('li');
  const taskText = taskItem.querySelector('span').textContent.split(' - ')[0].trim();

  // Log the "Deleted" action to history
  history.push({
    action: "Deleted",
    task: { text: taskText },
    timestamp: new Date().toLocaleString(),
  });

  // Remove task from local storage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.text.trim() !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Remove task from the DOM
  taskItem.remove();

  // Show in-app notification
  showInAppNotification("Task deleted successfully!");
}

// Function to open the history modal
function openModal() {
  const modal = document.getElementById('historyModal');
  const historyContent = document.getElementById('historyContent');

  // Clear previous content
  historyContent.innerHTML = '';

  // Add each history entry to the modal
  history.forEach(entry => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <strong>${entry.action}</strong>: ${entry.task.text} (${entry.timestamp})
    `;
    historyContent.appendChild(historyItem);
  });

  // Display the modal
  modal.style.display = 'block';
}

// Function to close the history modal
function closeModal() {
  document.getElementById('historyModal').style.display = 'none';
}

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
});

// Function to load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
       <span>${task.text} - ${task.date} ${task.time} (${task.category})</span>
      <div class="quote">${task.quote}</div>
      <textarea class="sticky-note" placeholder="Add a note..."></textarea>
      <div class="task-actions">
          <button class="complete-btn" onclick="completeTask(this)">Complete</button>
          <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
      </div>
    `;
    document.getElementById('tasks').appendChild(taskItem);
  });
}