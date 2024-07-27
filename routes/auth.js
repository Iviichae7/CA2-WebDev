const express = require("express");
const router = express.Router();
const promisePool = require("../config/database");

// Reg route
router.post("/submit", async (req, res) => {
  const { first_name, surname, username, email } = req.body;
  try {
    const [result] = await promisePool.query(
      "INSERT INTO Users (first_name, surname, username, email) VALUES (?, ?, ?, ?)",
      [first_name, surname, username, email]
    );
    req.session.userId = result.insertId;
    res.redirect(`/tasks/${result.insertId}`);
  } catch (err) {
    res.status(500);
  }
});

// Sign-in route
router.post("/signin", async (req, res) => {
  const { username, email } = req.body;
  try {
    const [users] = await promisePool.query(
      "SELECT * FROM Users WHERE username = ? AND email = ?",
      [username, email]
    );
    if (users.length > 0) {
      const user = users[0];
      req.session.userId = user.id;
      res.redirect(`/tasks/${user.id}`);
    } else {
      res.status(401);
    }
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
