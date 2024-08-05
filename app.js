require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const promisePool = require("./config/database");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const app = express();
const port = 3000;

const sessionStore = new MySQLStore({}, promisePool);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false },
  })
);

// Auth routes
app.use("/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.render("index", {
    signUpErrors: [],
    signInErrors: [],
    showSignInForm: false,
  });
});

const {
  getTasks,
  createTask,
  removeTask,
  getTaskById,
  updateTask,
} = require("./models/Task");

app.get("/tasks/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [user] = await promisePool.query("SELECT * FROM Users WHERE id = ?", [
      userId,
    ]);
    const tasks = await getTasks(userId, 0);
    const calendarTasks = await getTasks(userId, 2);
    res.render("tasks", { user: user[0], tasks, calendarTasks });
  } catch (err) {
    res.status(500);
  }
});

app.get("/task/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await getTaskById(taskId);
    res.json(task);
  } catch (err) {
    res.status(500);
  }
});

app.put("/tasks/:id/date", async (req, res) => {
  const { id } = req.params;
  const { start_date, end_date } = req.body;

  try {
    const [result] = await promisePool.query(
      "UPDATE Tasks SET start_date = ?, deadline = ?, StatusID = 2 WHERE id = ?",
      [start_date, end_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.send("Task updated and added to calendar");
  } catch (err) {
    res.status(500).send("Error updating task date");
  }
});

// Task route
app.post("/tasks", async (req, res) => {
  const { taskName, description, deadline } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(400);
  }

  try {
    const taskId = await createTask(userId, taskName, description, deadline);
    res.json({ taskId });
  } catch (err) {
    res.status(500);
  }
});

// Task removal route
app.post("/tasks/remove", async (req, res) => {
  const { taskId } = req.body;

  try {
    const success = await removeTask(taskId);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500);
  }
});

// Task update route
app.put("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { taskName, description, deadline } = req.body;

  const formattedDeadline = new Date(deadline).toISOString().split("T")[0];

  try {
    const success = await updateTask(
      taskId,
      taskName,
      description,
      formattedDeadline
    );
    if (success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
