document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".edit-task").forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      const taskId = event.target.getAttribute("data-task-id");
      console.log("Editing task with ID:", taskId);

      try {
        const response = await fetch(`/task/${taskId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const task = await response.json();

        document.getElementById("edit-task-input").value = task.task_name;
        document.getElementById("edit-task-description").value =
          task.description;

        const deadline = task.deadline ? new Date(task.deadline) : null;
        if (deadline) {
          const localDeadline = new Date(
            deadline.getTime() - deadline.getTimezoneOffset() * 60000
          );
          document.getElementById("edit-task-deadline").value = localDeadline
            .toISOString()
            .split("T")[0];
        } else {
          document.getElementById("edit-task-deadline").value = "";
        }

        document
          .getElementById("edit-task-form")
          .setAttribute("data-task-id", taskId);

        document.getElementById("edit-task-modal").classList.remove("hidden");
      } catch (error) {
        console.error(error);
      }
    });
  });

  document
    .getElementById("close-edit-task-modal")
    .addEventListener("click", () => {
      document.getElementById("edit-task-modal").classList.add("hidden");
    });

  document
    .getElementById("edit-task-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const taskId = event.target.getAttribute("data-task-id");
      const taskName = document.getElementById("edit-task-input").value;
      const description = document.getElementById(
        "edit-task-description"
      ).value;
      const deadline = document.getElementById("edit-task-deadline").value;

      try {
        const response = await fetch(`/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskName, description, deadline }),
        });

        if (response.ok) {
          window.location.reload();
        } else {
          throw new Error("Failed to edit task");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to edit task");
      }
    });
});
