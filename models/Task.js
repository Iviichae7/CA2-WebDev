const promisePool = require("../config/database");

async function getTasks(userId) {
  try {
    const [tasks] = await promisePool.query(
      "SELECT * FROM Tasks WHERE user_id = ?",
      [userId]
    );
    return tasks;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
}

async function createTask(userId, taskName, description, deadline) {
  console.log(
    `Creating task for userId: ${userId}, taskName: ${taskName}, description: ${description}, deadline: ${deadline}`
  );
  try {
    const [result] = await promisePool.query(
      "INSERT INTO Tasks (user_id, task_name, description, deadline) VALUES (?, ?, ?, ?)",
      [userId, taskName, description, deadline]
    );
    console.log(
      `Task created for user ID: ${userId} with task ID: ${result.insertId}`
    );
    return result.insertId;
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
}

module.exports = {
  getTasks,
  createTask,
};
