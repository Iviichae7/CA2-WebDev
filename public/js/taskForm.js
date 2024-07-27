document
  .getElementById("task-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submitted");

    const taskName = document.getElementById("task-input").value;
    const description = document.getElementById("task-description").value;
    const deadline = document.getElementById("task-deadline").value;

    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskName, description, deadline }),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      })
      .catch((error) => console.error("Error:", error));
  });
