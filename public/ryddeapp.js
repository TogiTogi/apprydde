//Grabs id's from app.html
const usersSelect = document.getElementById("users");
const taskSelect = document.getElementById("tasks");
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
  hideElementsBasedOnRole()
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

function populateUsers(users, currentUserIdFamily) {
  usersSelect.innerHTML = "";
  for (i = 0; i < users.length; i++) {
    if (users[i].idFamily === currentUserIdFamily) {
      const option = document.createElement("option")
      option.value = users[i].id;
      option.textContent = `${users[i].username}`;
      usersSelect.appendChild(option);
    }
  }
}

async function fetchLeaderboard(type) {
  try {
    const response = await fetch(`/leaderboard/${type}`)
    console.log("leaderboard", response)
    const leaderboardData = await response.json()
    console.log("leaderboard:", leaderboardData)
    populateLeaderboard(leaderboardData)
  } catch (error) {
    console.log('Failed to fetch leaderboard:', error);
  }
}

// Populate leaderboard
function populateLeaderboard(leaderboardData) {
  leaderboard.innerHTML = "";
  for (i = 0; i < leaderboardData.length; i++) {
    const li = document.createElement("li")
    li.textContent = `${leaderboardData[i].username} (${leaderboardData[i].points} pts)`;
    leaderboard.appendChild(li);
  }
}

document.getElementById('btnTotal').addEventListener('click', () => fetchLeaderboard('total'));
document.getElementById('btnMonth').addEventListener('click', () => fetchLeaderboard('month'));

async function fetchCompletedTasks() {
  try {
    const response = await fetch('/tasks/done');
    const tasks = await response.json();
    populateCompletedTasks(tasks);
  } catch (error) {
    console.log('Failed to fetch completed tasks:', error);
  }
}

// Populate completed tasks
function populateCompletedTasks(tasks) {
  const yourTasksDone = document.getElementById('yourTasksDone');
  yourTasksDone.innerHTML = ""; // Clear the div
  for (let task of tasks) {
    const li = document.createElement("li");
    li.textContent = task.name;
    yourTasksDone.appendChild(li);
  }
}

async function fetchCurrentUser() {
  try {
      const response = await fetch('/currentUser')
      
      let user = await response.json()
      thisUser = new User(user[0], user[1])
      document.getElementById('loggedInAs').innerText = thisUser.username;
      console.log(thisUser)
  } catch (error) {
      console.log('Failed to fetch thisUser:', error);
  }
}
fetch('/currentUser')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

  
//Funker ikke, vet ikke hvorfor
async function fetchCurrentUserRole() {
  try {
      const response = await fetch('/currentUser')
      
      let user = await response.json()
      return user[2]; // user[2] is the idRole
  } catch (error) {
      console.log('Failed to fetch currentUser:', error);
  }
}

async function hideElementsBasedOnRole() {
  const idRole = await fetchCurrentUserRole();
  console.log(`idRole: ${idRole}`); // Log the value of idRole
  
  if (idRole == 'barn' || idRole == 2) {
    document.getElementById('select-task').style.display = 'none';
    document.getElementById('create-task').style.display = 'none';
  }
}