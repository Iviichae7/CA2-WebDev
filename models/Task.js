const promisePool = require("../config/database");

async function getTasks(userId) {
  try {
    const [tasks] = await promisePool.query(
      "SELECT * FROM Tasks WHERE user_id = ?",
      [userId]
    );
    return tasks;
  } catch (err) {
    throw err;
  }
}

async function createTask(userId, taskName, description, deadline) {
  try {
    const [result] = await promisePool.query(
      "INSERT INTO Tasks (user_id, task_name, description, deadline) VALUES (?, ?, ?, ?)",
      [userId, taskName, description, deadline]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getTasks,
  createTask,
};
