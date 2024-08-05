const promisePool = require("../config/database");

async function getTasks(userId, statusId = 0) {
  try {
    const [tasks] = await promisePool.query(
      "SELECT * FROM Tasks WHERE user_id = ? AND StatusID = ?",
      [userId, statusId]
    );
    return tasks;
  } catch (err) {
    throw err;
  }
}

async function createTask(userId, taskName, description, deadline) {
  try {
    const [result] = await promisePool.query(
      "INSERT INTO Tasks (user_id, task_name, description, deadline, end_date, StatusID) VALUES (?, ?, ?, ?, ?, 0)",
      [userId, taskName, description, deadline, deadline]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  }
}

async function removeTask(taskId) {
  try {
    const [result] = await promisePool.query(
      "UPDATE Tasks SET StatusID = 1 WHERE id = ?",
      [taskId]
    );
    return result.affectedRows > 0;
  } catch (err) {
    throw err;
  }
}

async function getTaskById(taskId) {
  try {
    const [tasks] = await promisePool.query(
      "SELECT * FROM Tasks WHERE id = ? AND StatusID = 0",
      [taskId]
    );
    return tasks[0];
  } catch (err) {
    throw err;
  }
}

async function updateTask(taskId, taskName, description, deadline) {
  try {
    const [result] = await promisePool.query(
      "UPDATE Tasks SET task_name = ?, description = ?, deadline = ?, end_date = ? WHERE id = ?",
      [taskName, description, deadline, deadline, taskId]
    );
    return result.affectedRows > 0;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getTasks,
  createTask,
  removeTask,
  getTaskById,
  updateTask,
};
