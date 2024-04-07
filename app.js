const multer = require('multer');
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./ryddeapp.db', {verbose: console.log})
const session = require('express-session')
const dotenv = require('dotenv');
const upload = multer(); 

dotenv.config()


const saltRounds = 10
const app = express()
const staticPath = path.join(__dirname, 'public')


app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))



app.use(express.static(staticPath));

app.post('/task-add-done', (req, res) => {
    console.log(req.body)
    addTaskDone(req.body.userid, req.body.taskid, req.body.familyid)
    res.sendFile(path.join(__dirname, "public/app.html"));
});

function addTaskDone(userid, taskid){
    const sql = db.prepare('insert into done (iduser, idtask) values (?, ?)')
    sql.run(userid, taskid)
}

app.post('/task-create-done', (req, res) => {
    const taskData = req.body;
    createTask(taskData);
    
    res.sendFile(path.join(__dirname, "public/app.html"));
});

function createTask(taskData) {
    const sql = db.prepare('INSERT INTO task (name, points, description) VALUES (?, ?, ?)');
    sql.run(taskData.nameTask, taskData.pointsTask, taskData.descTask);
}


app.post('/login', upload.none(), (req, res) => {
    console.log(req.body)
    try {
        let user = checkUserPassword(req.body.familycode, req.body.username, req.body.password) 
        if ( user != null) {
            console.log(req.body.familycode)
            req.session.loggedIn = true
            req.session.username = req.body.username
            req.session.userrole = user.role
            req.session.userid = user.userid
    
        //res.redirect('/');
        // Pseudocode - Adjust according to your actual frontend framework or vanilla JS
 
        } 
        if (user == null || !req.session.loggedIn) {
            res.json(null);
        }
        else {res.json(user)}

    }
    catch {
       
       res.json(null);
    }

})



app.post('/register', (req, res) => {
    console.log("registerUser", req.body);
    const reguser = req.body;
    const user = addUser(reguser.username,  reguser.password, reguser.familycode, reguser.email, reguser.mobile, reguser.role)
    // Redirect to user list or confirmation page after adding user
    if (user)   {
        req.session.loggedIn = true
        req.session.username = user.username
        req.session.userrole = user.role
        req.session.userid = user.userid

        req.session.loggedIn = true
        //res.redirect('/');
        // Pseudocode - Adjust according to your actual frontend framework or vanilla JS
        if (req.session.loggedIn) {
            res.send(true)
        } 

    } 
    res.send(true)
});

//app.use(checkLoggedIn); // Apply globally if needed, or selectively to certain routes

 function checkUserPassword(idFamily, username, password){
    const sql = db.prepare('SELECT users.id as userid, username, roles.role as role, password FROM users inner join roles on users.idrole = roles.id WHERE username = ? and idFamily = ?');
    let user = sql.get(username, idFamily);
    if (user && bcrypt.compareSync(password, user.password)) {
        return user 
    } else {
        return null;
    }
}

 function checkLoggedIn(req, res, next) {
    console.log('CheckLoggedIn')
    if (!req.session.loggedIn) {
        res.sendFile(path.join(__dirname, "\public\\login.html"));
    } else {
        next();
    }
    
}




app.post('/user-add', (req, res) => {
    console.log(req.body)
    addUser(req.body.username, req.body.password)
    res.sendFile(path.join(__dirname, "public/app.html"));
     
 });
 

 
app.get('/logout', (req, res) => {
    req.session.destroy()
    res.sendFile(path.join(__dirname, "public/login.html"));
})

function addUser(username, password, idfamily, email, mobile, idrole)
 {
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO users (username, idfamily, idrole, password, email, mobile) " + 
                         " values (?, ?, ?, ?, ?, ?)")
    const info = sql.run(username,  idfamily, idrole, hash, email, mobile)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT users.id as userid, username, roles.role as role FROM users inner join roles on users.idRole = roles.id   WHERE users.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  
    console.log("rows.length",rows.length)

    return rows[0]
}


app.get('/tasks', checkLoggedIn, (req, res) => {
    
    const sql = db.prepare('select id, name, points from task')
    let rows = sql.all()
    console.log("rows.length", rows.length)

    res.send(rows);
});

app.get('/users', checkLoggedIn, (req, res) => {
    
    const sql = db.prepare('select id, username from users')
    let rows = sql.all()
    console.log("rows.length", rows.length)
    
    res.send(rows);
});

app.get('/leaderboard/total', checkLoggedIn, (req, res) => {
    const sql = db.prepare('SELECT users.username, SUM(points) AS points FROM done\n'
    + 'inner join task on done.idTask = task.id\n'
    + 'inner join users on done.idUser = users.id\n\n'
    + 'GROUP BY users.username\n'
    + 'ORDER BY points DESC')
    console.log(sql)
    let rows = sql.all()
    console.log("rows.length", rows.length)
    res.send(rows);
});

// Endpoint for current month points
app.get('/leaderboard/month', checkLoggedIn, (req, res) => {
    const currentDate = new Date();
    const currentYearMonth = `${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}`; // Format as YYYY-MM

    const sql = db.prepare('SELECT users.username, SUM(points) AS points FROM done\n'
    + 'inner join task on done.idTask = task.id\n'
    + 'inner join users on done.idUser = users.id\n'
    + 'WHERE SUBSTR(done.dt, 1, 7) = ?\n'
    + 'GROUP BY users.username\n'
    + 'ORDER BY points DESC')
    console.log(sql)
    let rows = sql.all(currentYearMonth); // Pass the parameter here
    console.log("rows.length", rows.length)
    res.send(rows);
});

app.get('/currentUser', checkLoggedIn,  (req, res) => {
    res.send([req.session.userid, req.session.username, req.session.userrole]);
});


app.get('/', checkLoggedIn,(req, res) => {
    res.sendFile(path.join(__dirname, "public/app.html"));
});
  


//denne må defineres etter middleware. 
//Jeg prøvde å flytte den opp, for å rydde i koden og da fungerte det ikke
app.use(express.static(staticPath));


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});