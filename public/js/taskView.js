document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".view-task").forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      const taskId = event.target.getAttribute("data-task-id");
      console.log("Viewing task with ID:", taskId);

      try {
        const response = await fetch(`/task/${taskId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const task = await response.json();
        console.log("Fetched task:", task);

        document.getElementById("view-task-name").innerText = task.task_name;
        document.getElementById("view-task-description").innerText =
          task.description;

        const deadline = task.deadline ? new Date(task.deadline) : null;
        const formattedDeadline = deadline
          ? `${deadline.getDate().toString().padStart(2, "0")}/${(
              deadline.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${deadline.getFullYear()}`
          : "No Deadline";
        document.getElementById(
          "view-task-deadline"
        ).innerText = `Deadline: ${formattedDeadline}`;

        document.getElementById("view-task-modal").classList.remove("hidden");
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    });
  });

  document
    .getElementById("close-view-task-modal")
    .addEventListener("click", () => {
      document.getElementById("view-task-modal").classList.add("hidden");
    });
});
