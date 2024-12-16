// let taskElementHTML = `
//                 <span class="${task.status === 'completed' ? 'task-completed' : ''}">
//                     ${task.title} - ${new Date(task.due_date).toLocaleString()}
//                 </span>
//                 <div>
//                 <button onclick="toggleTaskStatus(${task.id}, '${task.status}')">
//                     ${task.status === 'completed' ? 'Return for revision' : 'Change status'}
//                 </button>
//                 <button onclick="removeTask(${task.id})">
//                     <i class="fas fa-trash-alt"></i>
//                 </button>
//                 </div>
//                 `


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
                li.classList.add(task.status)
                li.innerHTML = `
                <span class="${task.status === 'completed' ? 'task-completed' : ''}">
                    ${task.title} - ${new Date(task.due_date).toLocaleString()}
                </span>
                <div>          
                <button onclick="toggleTaskStatus(${task.id}, '${task.status}')">
                    ${task.status === 'completed' ? 'Return for revision' : 'Change status'}
                </button>
                <button onclick="removeTask(${task.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
                </div>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetch tasks:", error));
}

function toggleTaskStatus(taskId, currentStatus) {
    let newStatus;

    switch (currentStatus) {
        case 'pending':
            newStatus = 'in_progress';
            break;
        case 'in_progress':
            newStatus = 'completed';
            break;
        case 'completed':
            newStatus = 'failed';
            break;
        case 'failed':
            newStatus = 'pending';
            break;
        default:
            console.error("Unknown status:", currentStatus);
            return;
    }

    fetch(`/api/tasks/${taskId}/change_status/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({status: newStatus}),
    })
        .then(response => response.json())
        .then(data => {
            fetchTasks();
            // showNotification("Task status updated!");
        })
        .catch(error => console.error('Error changing task status:', error));
}

function fetchSortedTasks() {
    const sortOption = document.getElementById('sort-options').value;

    fetch(`/api/tasks/?ordering=${sortOption}`)
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            data.forEach(task => {
                const li = document.createElement('li');
                li.classList.add('task');
                li.classList.add(task.status);
                li.innerHTML = `
                <span class="${task.status === 'completed' ? 'task-completed' : ''}">
                    ${task.title} - ${new Date(task.due_date).toLocaleString()}
                </span>
                <div>          
                <button onclick="toggleTaskStatus(${task.id}, '${task.status}')">
                    ${task.status === 'completed' ? 'Return for revision' : 'Change status'}
                </button>
                <button onclick="removeTask(${task.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
                </div>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching sorted tasks:", error));
}

function fetchFilteredTasks() {
    const status = document.getElementById('filter-status').value;
    const dueDate = document.getElementById('filter-date').value;

    let queryParams = [];
    if (status) queryParams.push(`status=${status}`);
    if (dueDate) queryParams.push(`due_date=${dueDate}`);

    const queryString = queryParams.length ? `${queryParams.join('&')}` : '';
    fetch(`/api/tasks/${queryString}`)
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            data.forEach(task => {
                const li = document.createElement('li');
                li.classList.add('task')
                li.classList.add(task.status)
                li.innerHTML = `
                <span class="${task.status === 'completed' ? 'task-completed' : ''}">
                    ${task.title} - ${new Date(task.due_date).toLocaleString()}
                </span>
                <div>          
                <button onclick="toggleTaskStatus(${task.id}, '${task.status}')">
                    ${task.status === 'completed' ? 'Return for revision' : 'Change status'}
                </button>
                <button onclick="removeTask(${task.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
                </div>`;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetcing filtered tasks:", error));
}

function clearFilters() {
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-date').value = '';
    fetchFilteredTasks();
}