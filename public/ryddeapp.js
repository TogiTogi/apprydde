




const usersSelect = document.getElementById("users");
const taskSelect = document.getElementById("tasks");
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");


//usersSelect.onchange = fetchTaskDone;

class User {
  constructor(id, username) {
  this.id = id;
  this.username = username;
  }
}




let users = null
let tasks = null
let familyPoints = null;
let done = null;
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
  console.log("fetchTasks")

  //await fetchTaskDone()

  };

  
document.addEventListener('DOMContentLoaded', main)


async function fetchTasks() {
  try {
    const response = await fetch('/tasks')

    tasks = await response.json()
    console.log(tasks)
    populateTasks(tasks);
  } catch (error) {
    console.log('failed to fetch tasks:', error);
  }
}

function populateTasks(tasks) {
  taskSelect.innerHTML = "";
  console.log(tasks)
  for (let i = 0; i < tasks.length; i++) {
    const option = document.createElement("option");
    option.value = tasks[i].id;
    option.textContent = `${tasks[i].name} (${tasks[i].points} pts)`;
    console.log(tasks[i]);
    taskSelect.appendChild(option);
  };
}

async function fetchUsers() {
  try {
    const response = await fetch('/users')

    console.log(response)

    users = await response.json()
    console.log(users)
    populateUsers(users)
  } catch (error) {
    console.log('Failed to fetch users:', error);
  }
}

function populateUsers(users) {
  usersSelect.innerHTML = "";
  console.log(users)
  for (i = 0; i < users.length; i++) {
    const option = document.createElement("option")
    option.value = users[i].id;
    option.textContent = `${users[i].username}`;
    console.log(users[i]);
    usersSelect.appendChild(option);
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

