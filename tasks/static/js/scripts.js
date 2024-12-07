function getCSRFToken() {
    const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    return csrfToken ? csrfToken.split('=')[1] : '';
}

function addTask() {
    const taskTitle = document.getElementById('task-title').value;
    const taskDueDate = document.getElementById('task-due-date').value;
    const taskDescription = document.getElementById('task-description').value;

    if (!taskTitle || !taskDueDate) {
        alert("Please, fill all the fields");
        return;
    }

    fetch('/api/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            due_date: taskDueDate,
            status: 'pending',
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task added: ', data);
            fetchTasks();
        })
        .catch(error => console.error('Error adding task:', error));
}

function removeTask(taskId) {
    fetch(`/api/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: {
            'content-type': "application/json",
            'X-CSRFToken': getCSRFToken(),

        }
    })
        .then(response => {
            if (response.ok) {
                fetchTasks();
            }
        })
        .catch(error => console.error('Error deleting task:', error));
}

function fetchTasks() {
    fetch('/api/tasks/')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            data.forEach(task => {
                const li = document.createElement('li');
                li.classList.add('task');
                li.innerHTML = `
                <span class="${task.status === 'completed' ? 'task-completed' : ''}">
                    ${task.title} - ${new Date(task.due_date).toLocaleString()}
                </span>
                <button onclick="removeTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetch tasks:", error));
}