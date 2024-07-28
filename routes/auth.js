const express = require("express");
const router = express.Router();
const promisePool = require("../config/database");
const { body, validationResult } = require("express-validator");

// Reg route
router.post(
  "/submit",
  [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("surname").notEmpty().withMessage("Surname is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is not valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        signUpErrors: errors.array(),
        signInErrors: [],
        showSignInForm: false,
      });
    }

    const { first_name, surname, username, email } = req.body;

    try {
      const [existingUsers] = await promisePool.query(
        "SELECT * FROM Users WHERE username = ? OR email = ?",
        [username, email]
      );
      if (existingUsers.length > 0) {
        return res.status(400).render("index", {
          signUpErrors: [{ msg: "Username or email already exists!" }],
          signInErrors: [],
          showSignInForm: false,
        });
      }

      const [result] = await promisePool.query(
        "INSERT INTO Users (first_name, surname, username, email) VALUES (?, ?, ?, ?)",
        [first_name, surname, username, email]
      );
      req.session.userId = result.insertId;
      res.redirect(`/tasks/${result.insertId}`);
    } catch (err) {
      res.status(500);
    }
  }
);

// Sign-in route
router.post(
  "/signin",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is not valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        signUpErrors: [],
        signInErrors: errors.array(),
        showSignInForm: true,
      });
    }

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
        return res.status(401).render("index", {
          signUpErrors: [],
          signInErrors: [{ msg: "Username or email doesn't exists!" }],
          showSignInForm: true,
        });
      }
    } catch (err) {
      res.status(500);
    }
  }
);

module.exports = router;
