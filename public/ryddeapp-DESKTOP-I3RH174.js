//Grabs id's from app.html
const usersSelect = document.getElementById("users");
const taskSelect = document.getElementById("tasks");
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const leaderboard = document.getElementById("leaderboard");


//usersSelect.onchange = fetchTaskDone;

class User {
  constructor(id, username) {
  this.id = id;
  this.username = username;
  }
}




let users = null
let tasks = null
let familyPoints = null
let done = null
let thisUser = null




async function main() {
  
  await fetchData()
}


async function fetchData() {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  /* await fetchCurrentUser()

  
  await fetchStats() */
  await fetchUsers()
  await fetchTasks()
  await fetchLeaderboard()

  //await fetchTaskDone()

  };

  
document.addEventListener('DOMContentLoaded', main)


async function fetchTasks() {
  try {
    const response = await fetch('/tasks')

    tasks = await response.json()
    console.log("tasks:", tasks)
    populateTasks(tasks);
  } catch (error) {
    console.log('failed to fetch tasks:', error);
  }
}

function populateTasks(tasks) {
  taskSelect.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    const option = document.createElement("option");
    option.value = tasks[i].id;
    option.textContent = `${tasks[i].name} (${tasks[i].points} pts)`;
    taskSelect.appendChild(option);
  };
}

async function fetchUsers() {
  try {
    const response = await fetch('/users')

    console.log("user", response)

    users = await response.json()
    console.log("users:", users)
    populateUsers(users)
  } catch (error) {
    console.log('Failed to fetch users:', error);
  }
}

function populateUsers(users) {
  usersSelect.innerHTML = "";
  for (i = 0; i < users.length; i++) {
    const option = document.createElement("option")
    option.value = users[i].id;
    option.textContent = `${users[i].username}`;
    usersSelect.appendChild(option);
  }
}

async function fetchLeaderboard() {
  try {
    const response = await fetch('/leaderboard')

    console.log("leaderboard", response)

    const leaderboardData = await response.json()
    console.log("leaderboard:", leaderboardData)
    populateLeaderboard(leaderboardData)
  } catch (error) {
    console.log('Failed to fetch leaderboard:', error);
  }
}

function populateLeaderboard(leaderboardData) {
  leaderboard.innerHTML = "";
  for (let i = 0; i < leaderboardData.length; i++) {
    const li = document.createElement("li")
    li.textContent = `${leaderboardData[i].username} (${leaderboardData[i].points} pts)`;
    leaderboard.appendChild(li);
  }
}

async function fetchCurrentUser() {
  try {
      const response = await fetch('/currentUser')
      
      let user = await response.json()
      thisUser = new User(user[0], user[1])
      console.log(thisUser)
  } catch (error) {
      console.log('Failed to fetch thisUser:', error);
  }
}