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
  res.render("index");
});

const { getTasks, createTask } = require("./models/Task");

app.get("/tasks/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [user] = await promisePool.query("SELECT * FROM Users WHERE id = ?", [
      userId,
    ]);
    const tasks = await getTasks(userId);
    res.render("tasks", { user: user[0], tasks });
  } catch (err) {
    res.status(500);
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
