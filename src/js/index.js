import * as toDo from './to-do';
import '../css/styles.css';


// Universal projects list
let projects = [];

//DOM
let projectListDOM = Array.from(document.querySelectorAll('.project-todos'));
let addProjectDOM = document.querySelector('.add-project');
const navProjects = document.querySelector('.page-content');


// Universal id counter;
let idCount = 0;

// Deselecting every project but the one clicked
const navSync = () => {
    const projectMenuDOM = Array.from(document.querySelectorAll('.page-content ul li'));
    projectMenuDOM.pop();
    projectMenuDOM.forEach((project) => project.addEventListener("click", (e) => {
        let projectMenuId = project.id[project.id.length - 1];
        // Modifying the navigation bar
        projectMenuDOM.forEach((el) => el.classList.remove('project-checked'));
        e.target.classList.add("project-checked");
        // Showing only our project;
        projectListDOM.forEach(elo => {
            (elo.id === projectMenuId) ? elo.classList.remove("hidden") : elo.classList.add("hidden");
        });
    }))
}

const deleteTaskSync = () => {
    const navigation = document.body;
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.delete-btn');
        if (target) {
            const taskDOM = target.parentNode.parentNode;
            const projectDOM = taskDOM.parentNode;
            projectDOM.removeChild(taskDOM);
        }
    })
}

const editTaskSync = () => {
    const navigation = document.body;
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.edit-btn');
        if (target) {
            target.classList.add("hidden");
            const taskDOM = target.parentNode.parentNode;
            const taskTitleDOM = taskDOM.querySelector('h3');
            const taskDescDOM = taskDOM.querySelector('p');
            const checkBtnDOM = taskDOM.querySelector('.check-btn');

            taskTitleDOM.setAttribute("contenteditable", "true");
            taskDescDOM.setAttribute("contenteditable", "true");

            checkBtnDOM.classList.remove("hidden");
        }
    })
}

const checkTaskSync = () => {
    const navigation = document.body;
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.check-btn');
        if (target && target.matches('.check-btn')) {
            target.classList.add("hidden");
            const taskDOM = target.parentNode.parentNode;
            const taskTitleDOM = taskDOM.querySelector('h3');
            const taskDescDOM = taskDOM.querySelector('p');
            const editBtnDOM = taskDOM.querySelector('.edit-btn');

            taskTitleDOM.setAttribute("contenteditable", "false");
            taskDescDOM.setAttribute("contenteditable", "false");

            editBtnDOM.classList.remove("hidden");
        }
    })
}

//addTaskSync Listener callback function
const callback = (addTaskDOM, e) => {
    const projectDOM = addTaskDOM.parentNode;
    projectDOM.removeChild(addTaskDOM);
    projectDOM.innerHTML += `
               <div class="todo-card todo-card-important">
            <h3>New task</h3>
            <div class="btn-wrapper" style="grid-area: edit;justify-self: end;display: flex; justify-content: end">
                        <div class="btn check-btn hidden"><i class="fas fa-check"></i></div>
            <div class="btn edit-btn"><i class="fas fa-edit"></i></div>
            <span class="btn priority important"><i class="fas fa-exclamation"></i></span>
            <div class="btn delete-btn"><i class="fas fa-trash"></i></div>
            </div>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Eveniet id mollitia nisi quasi velit. Deserunt eligendi nam quos
                temporibus unde?
            </p>
            <span class="date-due">15/03/2200</span>
            <span class="btn done-status"><i class="fas fa-check"></i></span>
        </div>
        `
    projectDOM.appendChild(addTaskDOM);
}

const addTaskSync = () => {
    const navigation = document.body;
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.add-btn');
        if (target) {
            callback(target, e);
        }
    })
}

const updateDOM = () => {
    projectListDOM = Array.from(document.querySelectorAll('.project-todos'));
    addProjectDOM = document.querySelector('.add-project');

    projectsSync();
    addProject();
}


const doneSync = () => {
    const navigation = document.body;
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.done-status');
        if (target) {
            const taskDOM = target.parentNode;
            taskDOM.classList.toggle("todo-done");
            target.classList.toggle("done");
        }
    })
}

const prioritySync = () => {
    const navigation = document.body;
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.priority');
        if (target) {
            const taskDOM = target.parentNode.parentNode;
            target.classList.toggle("important");
            taskDOM.classList.toggle("todo-card-important");
        }
    })
}

const projectsSync = () => {
    projects = [];
    projectListDOM.forEach(projectDOM => {
        const project = toDo.Project(projectDOM.id);
        const projectTasksDOM = projectDOM.querySelectorAll('.todo-card');
        projectTasksDOM.forEach(taskDOM => {
            const taskTitle = taskDOM.querySelector('h3').textContent;
            const taskDesc = taskDOM.querySelector('p').textContent;
            const taskDueDate = taskDOM.querySelector('.date-due').textContent;
            const taskPriority = taskDOM.querySelector('.priority').classList.contains("important");
            const taskDone = taskDOM.querySelector('.done-status').classList.contains("done");
            const task = toDo.Task(taskTitle, taskDesc, taskDueDate, taskPriority, taskDone);
            project.add(task);
        })
        projects.push(project);
    })
    idCount = projects[projects.length - 1].getId();
}

const addProject = () => {
    addProjectDOM.addEventListener("click", (e) => {
        const projectMenuParentDOM = document.querySelector('.page-content ul');
        idCount++;
        projectMenuParentDOM.removeChild(addProjectDOM);
        projectMenuParentDOM.innerHTML += `
            <li id="op-${idCount}" contenteditable="true">
                New project
            </li>
        `
        projectMenuParentDOM.appendChild(addProjectDOM);
        navProjects.innerHTML += `
        <section class="project-todos hidden" id="${idCount}">
            <div class="btn add-btn"><i class="fas fa-plus fa-2x"></i></div>
        </section>
        `
        navSync();
    })
}


// Initial sync
navSync();
projectsSync();

addTaskSync();

addProject();

editTaskSync();
checkTaskSync();
deleteTaskSync();

doneSync();
prioritySync();

setInterval(updateDOM, 1000);



