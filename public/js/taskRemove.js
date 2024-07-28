document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".remove-task").forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      const taskId = event.target.getAttribute("data-task-id");
      const response = await fetch("/tasks/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });
      const result = await response.json();
      if (result.success) {
        window.location.reload();
      } else {
        console.error("Failed to remove task");
      }
    });
  });
});
