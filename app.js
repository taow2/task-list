// Get input element
let filterInput = document.getElementById('filterInput');

// Add event listener
filterInput.addEventListener('keyup', filterNames);

function filterNames() {
    // Get value of input
    let filterValue = document.getElementById('filterInput').value.toUpperCase();

    // Get td for name
    let td = document.querySelectorAll('td.task_name');

    // Loop through item tds
    for(let i = 0; i < td.length; i++) {
        // If matched
        if(td[i].innerText.toUpperCase().indexOf(filterValue) > -1 ) {
            td[i].parentNode.style.display = '';
        }
        else {
            td[i].parentNode.style.display = 'none';
        }
    }
}


// Task Class
class Task {
    constructor(name, due, due_date, dir) {
        this.name = name;
        this.due = due;
        this.due_date = due_date;
        this.dir = dir;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayTasks() {
        const tasks = Store.getTasks();

        tasks.forEach((task) => UI.addTaskToList(task));
    } 
    
    static addTaskToList(task) {
        const list = document.querySelector('#task-list');

        const row = document.createElement('tr');

        // row.classList.add('item');

        let cur_date = new Date();
        let days_remain = (task.due_date - cur_date.getTime()) / 1000 / 60 / 60 / 24;

        row.innerHTML = `
            <td class="task_name">${task.name}</td>
            <td>${task.due}</td>
            <td>${Math.ceil(days_remain)}</td>
            <td>${task.dir}</td>
            <td><a href='#' class="btn btn-danger btn-sm delete">X</td>
        `;

        list.appendChild(row);
    }

    static deleteTask(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#task-form');
        container.insertBefore(div, form);
        // Vanish in 3 sec (3000 milisec)
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#due').value = '';
        document.querySelector('#dir').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getTasks() {
        let tasks;
        if(localStorage.getItem('tasks') === null) {
            tasks = [];
        }
        else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
    }

    static addTask(task) {
        const tasks = Store.getTasks();

        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeTask(dir) {
        const tasks = Store.getTasks();

        tasks.forEach((task, index) => {
            if(task.dir === dir) {
                tasks.splice(index, 1);
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Event: Display Tasks
document.addEventListener('DOMContentLoaded', UI.displayTasks);

// Event: Add Tasks
document.querySelector('#task-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
    
    // Get form values
    const name = document.querySelector('#name').value;
    const due = document.querySelector('#due').value;
    const due_date = document.querySelector('#due').valueAsDate.getTime();
    const dir = document.querySelector('#dir').value;

    // Validate
    if(name === '' || due === '' || dir === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    }
    else {
        // Instatiate task
        const task = new Task(name, due, due_date, dir);

        // Add task to UI
        UI.addTaskToList(task);

        // Add task to store
        Store.addTask(task);

        // Show success message
        UI.showAlert('Task Added', 'success');

        // Clear fields
        UI.clearFields();

    }


});

// Event: Remove Tasks
document.querySelector('#task-list').addEventListener('click', (e) => {
    // Remove task from UI
    UI.deleteTask(e.target);

    // Remove task from store
    Store.removeTask(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Task Removed', 'success');
});