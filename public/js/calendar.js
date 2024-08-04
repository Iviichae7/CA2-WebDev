document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var taskForm = document.getElementById("task-form");
  var taskList = document.getElementById("task-list");
  var taskInput = document.getElementById("task-input");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "timeGridDay,timeGridWeek,dayGridMonth",
    },
    buttonText: {
      today: "Today",
      month: "Month",
      week: "Week",
      day: "Day",
    },
    editable: true,
    selectable: true,
    droppable: true,
    events: window.calendarTasks.map((task) => ({
      title: task.task_name,
      start: task.deadline,
      id: task.id,
    })),
    drop: function (info) {
      if (info.draggedEl) {
        var eventObj = JSON.parse(info.draggedEl.dataset.event);
        var events = calendar.getEvents();
        var isDuplicate = events.some(
          (event) =>
            event.title === eventObj.title && event.startStr === info.dateStr
        );

        if (!isDuplicate) {
          calendar.addEvent({
            title: eventObj.title,
            start: info.dateStr,
            allDay: info.allDay,
            id: eventObj.id,
          });

          var taskId = info.draggedEl.getAttribute("data-task-id");
          fetch(`/tasks/${taskId}/date`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ date: info.dateStr }),
          })
            .then((response) => {
              if (response.ok) {
                console.log("Task date updated:", taskId);
                info.draggedEl.remove();
              } else {
                throw new Error("Failed to update task date");
              }
            })
            .catch((error) => console.error(error));
        } else {
          console.log(eventObj.title, info.dateStr);
        }
      }
    },
    eventReceive: function (info) {
      info.event.setProp("editable", true);
      console.log(info.event.title, info.event.startStr);
    },
    eventDidMount: function (info) {
      info.el.style.backgroundColor = "#ffcccb";
      info.el.style.border = "1px solid #ff0000";
      info.el.style.padding = "5px";
      info.el.style.borderRadius = "5px";
      info.el.style.whiteSpace = "normal";
    },
  });
  calendar.render();

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var taskText = taskInput.value.trim();
    if (taskText !== "") {
      var listItem = document.createElement("li");
      listItem.textContent = taskText;
      listItem.classList.add(
        "bg-white",
        "p-2",
        "rounded",
        "shadow",
        "draggable"
      );
      listItem.setAttribute("data-event", JSON.stringify({ title: taskText }));
      taskList.appendChild(listItem);
      taskInput.value = "";
      makeDraggable(listItem);
    }
  });

  function makeDraggable(el) {
    new FullCalendar.Draggable(el, {
      itemSelector: ".draggable",
      eventData: function (eventEl) {
        return JSON.parse(eventEl.dataset.event);
      },
    });
  }

  document.querySelectorAll("#task-list .draggable").forEach(function (el) {
    makeDraggable(el);
  });
});
