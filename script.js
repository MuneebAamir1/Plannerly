document.getElementById('themeToggle').addEventListener('click', function() {
  document.body.classList.toggle('light-theme');
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

function getRandomQuote() {
  return quotesArray[Math.floor(Math.random() * quotesArray.length)];
}

function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  requestNotificationPermission();
});

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

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskTime = document.getElementById('taskTime');
  const taskCategory = document.getElementById('taskCategory');
  const tasksList = document.getElementById('tasks');

  if (taskInput.value.trim() === '') {
      alert('Please enter a task.');
      return;
  }

  const task = {
    text: taskInput.value,
    date: taskDate.value,
    time: taskTime.value,
    category: taskCategory.value,
    quote: getRandomQuote(),
  };

  scheduleNotification(task);

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
  tasksList.appendChild(taskItem);

  showInAppNotification("Task added successfully!");

  taskInput.value = '';
  taskDate.value = '';
  taskTime.value = '';
  taskCategory.value = 'work';
}

function completeTask(button) {
  const taskItem = button.closest('li');
  taskItem.classList.toggle('done');
}

function deleteTask(button) {
  const taskItem = button.closest('li');
  taskItem.remove();
  showInAppNotification("Task deleted successfully!");
}

function openModal() {
  document.getElementById('historyModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('historyModal').style.display = 'none';
}

function searchTasks() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const tasks = document.querySelectorAll('#tasks li');

  tasks.forEach(task => {
      const taskText = task.textContent.toLowerCase();
      if (taskText.includes(searchInput)) {
          task.style.display = 'flex';
      } else {
          task.style.display = 'none';
      }
  });
}

// Filtering Functionality
document.getElementById('showAll').addEventListener('click', function() {
  filterTasks('all');
});

document.getElementById('showCompleted').addEventListener('click', function() {
  filterTasks('completed');
});

document.getElementById('showPending').addEventListener('click', function() {
  filterTasks('pending');
});

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
