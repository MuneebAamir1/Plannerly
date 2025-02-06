// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', function () {
  document.body.classList.toggle('light-theme');
});

// Request notification permission on page load
document.addEventListener("DOMContentLoaded", function () {
  requestNotificationPermission();
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

// Function to add a task
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskTime = document.getElementById('taskTime');
  const taskCategory = document.getElementById('taskCategory');
  const tasksList = document.getElementById('tasks');
  const historyList = document.getElementById('historyList');

  // Validate task input
  if (taskInput.value.trim() === '') {
    alert('Please enter a task.');
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

  // Create history item
  const historyItem = document.createElement('li');
  historyItem.innerHTML = `
    <span>${taskInput.value} - ${taskDate.value} ${taskTime.value} (${taskCategory.value})</span>
    <span class="status">Pending</span>
  `;
  historyItem.dataset.task = taskInput.value;
  historyItem.dataset.date = taskDate.value;
  historyItem.dataset.time = taskTime.value;
  historyList.appendChild(historyItem);

  // Clear input fields
  taskInput.value = '';
  taskDate.value = '';
  taskTime.value = '';
  taskCategory.value = 'work';

  // Show notification and schedule reminder
  showNotification('Task added successfully!');
  scheduleNotification(taskInput.value, taskDate.value, taskTime.value, historyItem);
}

// Function to mark a task as complete
function completeTask(button) {
  const taskItem = button.closest('li');
  taskItem.classList.toggle('done');
  updateHistoryStatus(taskItem.querySelector('span').textContent, 'Done');
}

// Function to delete a task
function deleteTask(button) {
  const taskItem = button.closest('li');
  updateHistoryStatus(taskItem.querySelector('span').textContent, 'Deleted');
  taskItem.remove();
  showNotification('Task deleted successfully!');
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
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

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
});

// Function to schedule a notification
function scheduleNotification(task, date, time, historyItem) {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      const taskDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      const delay = taskDateTime - now;

      if (delay > 0) {
        setTimeout(() => {
          const notification = new Notification('Task Reminder', {
            body: `Reminder: ${task}`
          });
          notification.onclick = () => {
            window.focus();
          };
          historyItem.querySelector('.status').textContent = 'Reminded but Pending';
        }, delay);
      }
    }
  });
}

// Function to request notification permission
function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}