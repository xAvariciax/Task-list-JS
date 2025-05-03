document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");
  const taskInput = document.getElementById("task-input-text");
  const taskForm = document.getElementById("main-form");
  const taskCounterNum = document.getElementById("task-list-counter-num");
  const taskCounterCompleted = document.getElementById("task-list-counter-completed");
  const taskCounterIncomplete = document.getElementById("task-list-counter-incomplete");

  // Función para guardar tareas en LocalStorage
  const saveTasksToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll(".task-item")).map((taskItem) => ({
      text: taskItem.querySelector(".task-item-text").textContent,
      completed: taskItem.classList.contains("task-item-completed"),
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Función para cargar tareas desde LocalStorage
  const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const taskItem = createTaskElement(task.text, task.completed);
      taskList.appendChild(taskItem);
    });
    updateCounters();
  };

  // Actualiza los contadores
  const updateCounters = () => {
    const totalTasks = taskList.children.length;
    const completedTasks = Array.from(taskList.children).filter((taskItem) =>
      taskItem.classList.contains("task-item-completed")
    ).length;
    const incompleteTasks = totalTasks - completedTasks;

    taskCounterNum.textContent = `Tasks: ${totalTasks}`;
    taskCounterCompleted.textContent = `Completed: ${completedTasks}`;
    taskCounterIncomplete.textContent = `Incomplete: ${incompleteTasks}`;
  };

  // Crear un elemento de tarea
  const createTaskElement = (text, completed = false) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    if (completed) {
      taskItem.classList.add("task-item-completed");
    }

    // Crear el texto de la tarea
    const taskText = document.createElement("p");
    taskText.classList.add("task-item-text");
    taskText.textContent = text;

    // Crear el botón de completar
    const completeButton = document.createElement("input");
    completeButton.type = "button";
    completeButton.value = "Complete";
    completeButton.classList.add("task-item-check-button");

    // Crear el botón de eliminar
    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.classList.add("task-item-delete-button");

    // Agregar los elementos al contenedor de la tarea
    taskItem.appendChild(taskText);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);

    return taskItem;
  };

  // Agregar una nueva tarea
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que la página se recargue

    const taskText = taskInput.value.trim();
    if (taskText === "") {
      alert("La tarea no puede estar vacía.");
      return;
    }

    // Crear el elemento de la tarea
    const taskItem = createTaskElement(taskText);

    // Agregar la tarea a la lista
    taskList.appendChild(taskItem);

    // Limpiar el campo de entrada
    taskInput.value = "";

    // Actualizar los contadores y guardar en LocalStorage
    updateCounters();
    saveTasksToLocalStorage();
  });

  // Marca una tarea como completada
  taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-item-check-button")) {
      const taskItem = event.target.closest(".task-item");
      const updatedTaskItem = taskItem.cloneNode(true);
      updatedTaskItem.classList.toggle("task-item-completed");
      taskList.replaceChild(updatedTaskItem, taskItem);
      updateCounters();
      saveTasksToLocalStorage();
    }
  });

  // Elimina una tarea
  taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-item-delete-button")) {
      const taskItem = event.target.closest(".task-item");
      const updatedTaskList = Array.from(taskList.children).filter((item) => item !== taskItem);
      taskList.innerHTML = "";
      updatedTaskList.forEach((item) => taskList.appendChild(item));
      updateCounters();
      saveTasksToLocalStorage();
    }
  });

  // Cargar tareas desde LocalStorage al cargar la página
  loadTasksFromLocalStorage();
});