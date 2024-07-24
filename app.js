const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const promisePool = require("./config/database");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", async (req, res) => {
  const { first_name, surname, username, email } = req.body;
  try {
    const [result] = await promisePool.query(
      "INSERT INTO Users (first_name, surname, username, email) VALUES (?, ?, ?, ?)",
      [first_name, surname, username, email]
    );
    res.redirect(`/tasks/${result.insertId}`);
  } catch (err) {
    res.status(500).send("Error adding user");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
