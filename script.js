// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', function () {
  document.body.classList.toggle('light-theme');
});

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', function () {
  requestNotificationPermission();
  loadTasks(); 
  loadHistory(); 
});

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

// Function to get a random quote
function getRandomQuote() {
  return quotesArray[Math.floor(Math.random() * quotesArray.length)];
}

// Function to validate task date and time
function isTaskDateTimeValid(taskDate, taskTime) {
  const currentDateTime = new Date();
  const taskDateTime = new Date(`${taskDate}T${taskTime}`);
  return taskDateTime > currentDateTime;
}

// Function to validate task text
function isTaskTextValid(taskText) {
  const regex = /^[a-zA-Z0-9\s.,!?]+$/;
  return regex.test(taskText);
}

// Function to add a task
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskTime = document.getElementById('taskTime');
  const taskCategory = document.getElementById('taskCategory');
  const tasksList = document.getElementById('tasks');
  const historyList = document.getElementById('historyList');

  // Validate task input
  if (!taskInput.value.trim()) {
    alert('Please enter a task.');
    return;
  }

  if (!isTaskDateTimeValid(taskDate.value, taskTime.value)) {
    alert('Please enter a valid future date and time.');
    return;
  }

  if (!isTaskTextValid(taskInput.value)) {
    alert('Please enter a valid task description.');
    return;
  }

  // Create task item
  const taskItem = document.createElement('li');
  taskItem.innerHTML = `
    <span>${taskInput.value} - ${taskDate.value} ${taskTime.value} (${taskCategory.value})</span>
    <div class="quote">${getRandomQuote()}</div>
    <textarea class="sticky-note" placeholder="Add a note..."></textarea>
    <div class="task-actions">
      <button class="complete-btn" onclick="completeTask(this)">Complete</button>
      <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
    </div>
  `;
  tasksList.appendChild(taskItem);

  showInAppNotification("Task added successfully!");
  // Create history item  
  scheduleNotification(taskDate.value, taskTime.value);
  const historyItem = document.createElement('li');
  historyItem.innerHTML = `
    <span>${taskInput.value} - ${taskDate.value} ${taskTime.value} (${taskCategory.value})</span>
    <span class="status">Pending</span>
  `;
  historyItem.dataset.task = taskInput.value;
  historyItem.dataset.date = taskDate.value;
  historyItem.dataset.time = taskTime.value;
  historyList.appendChild(historyItem);

  // Save tasks and history to localStorage
  saveTasks();
  saveHistory();

  // Clear input fields
  taskInput.value = '';
  taskDate.value = '';
  taskTime.value = '';
  taskCategory.value = 'work';

}

// Function to mark a task as complete
function completeTask(button) {
  const taskItem = button.closest('li');
  taskItem.classList.toggle('done');
  updateHistoryStatus(taskItem.querySelector('span').textContent, 'Done');
  saveTasks(); 
  saveHistory(); 
}

// Function to delete a task
function deleteTask(button) {
  const taskItem = button.closest('li');
  updateHistoryStatus(taskItem.querySelector('span').textContent, 'Deleted');
  taskItem.remove();
  showInAppNotification("Task deleted successfully!");
  saveTasks(); // Save updated tasks to localStorage
  saveHistory(); // Save updated history to localStorage
}

// Function to update history status
function updateHistoryStatus(taskText, status) {
  const historyItems = document.querySelectorAll('#historyList li');
  historyItems.forEach(item => {
    if (item.dataset.task === taskText.split(' - ')[0]) {
      item.querySelector('.status').textContent = status;
    }
  });
}

// Function to show a notification


// Function to open the history modal
function openModal() {
  document.getElementById('historyModal').style.display = 'block';
}

// Function to close the history modal
function closeModal() {
  document.getElementById('historyModal').style.display = 'none';
}

// Clear history
document.getElementById('clearHistoryBtn').addEventListener('click', function () {
  document.getElementById('historyList').innerHTML = '';
  localStorage.removeItem('history'); // Clear history from localStorage
});

// Function to schedule a notification


// Function to request notification permission
function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

// Filter tasks
document.getElementById('showAll').addEventListener('click', () => filterTasks('all'));
document.getElementById('showCompleted').addEventListener('click', () => filterTasks('completed'));
document.getElementById('showPending').addEventListener('click', () => filterTasks('pending'));

function filterTasks(filter) {
  const tasks = document.querySelectorAll('#tasks li');
  tasks.forEach(task => {
    if (filter === 'all') {
      task.style.display = 'flex';
    } else if (filter === 'completed') {
      task.classList.contains('done') ? task.style.display = 'flex' : task.style.display = 'none';
    } else if (filter === 'pending') {
      task.classList.contains('done') ? task.style.display = 'none' : task.style.display = 'flex';
    }
  });
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#tasks li').forEach(task => {
    tasks.push({
      text: task.querySelector('span').textContent,
      done: task.classList.contains('done')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const tasksList = document.getElementById('tasks');
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <span>${task.text}</span>
      <div class="quote">${getRandomQuote()}</div>
      <textarea class="sticky-note" placeholder="Add a note..."></textarea>
      <div class="task-actions">
        <button class="complete-btn" onclick="completeTask(this)">Complete</button>
        <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
      </div>
    `;
    if (task.done) {
      taskItem.classList.add('done');
    }
    tasksList.appendChild(taskItem);
  });
}

// Save history to localStorage
function saveHistory() {
  const history = [];
  document.querySelectorAll('#historyList li').forEach(item => {
    history.push({
      task: item.dataset.task,
      date: item.dataset.date,
      time: item.dataset.time,
      status: item.querySelector('.status').textContent
    });
  });
  localStorage.setItem('history', JSON.stringify(history));
}

// Load history from localStorage
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  const historyList = document.getElementById('historyList');
  history.forEach(item => {
    const historyItem = document.createElement('li');
    historyItem.innerHTML = `
      <span>${item.task} - ${item.date} ${item.time}</span>
      <span class="status">${item.status}</span>
    `;
    historyItem.dataset.task = item.task;
    historyItem.dataset.date = item.date;
    historyItem.dataset.time = item.time;
    historyList.appendChild(historyItem);
  });
}

function scheduleNotification(task) {
  let taskDateTime = new Date(task.date + "T" + task.time);
  let timeUntilTask = taskDateTime - new Date();
  if (timeUntilTask > 0) {
    setTimeout(() => showNotification(task.text, task.quote), timeUntilTask);
  }
}
function showNotification(taskText, quote) {
  if (Notification.permission === "granted") {
    new Notification("Task Reminder", { body: `${taskText}\nMotivation: ${quote}` });
    document.getElementById("notificationSound").play();
  }
}

function showInAppNotification(message) {
  const notificationDiv = document.getElementById("notification");
  notificationDiv.textContent = message;
  notificationDiv.style.display = "block";
  setTimeout(() => {
    notificationDiv.style.display = "none";
  }, 3000);
}