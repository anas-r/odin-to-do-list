import * as toDo from './to-do';
import '../css/styles.css';
import * as Cookies from 'js-cookie';


//

//DOM
const pageContentDOM = document.querySelector('.page-content');
const navDOM = document.querySelector('nav');
const navigation = document.body;

// Universal id counter;
let idCount = 1;

// Deselecting every project but the one clicked
const navSync = () => {
    navDOM.addEventListener("click",(e) => {
        const target = e.target.closest('.project-option');
        if (target) {
            const projectNavigationAll = document.querySelectorAll('.project-option');
            const projectNavigationId = target.id[target.id.length-1];
            const projectsDOM = pageContentDOM.querySelectorAll('.project-todos');

            projectNavigationAll.forEach(pjNav => pjNav.classList.remove("project-checked"));
            target.classList.add("project-checked");

            projectsDOM.forEach(pj => {
                (pj.id === projectNavigationId) ?
                pj.classList.remove("hidden") : pj.classList.add("hidden")
            })
        }
    })
}

// Delete a task button
const deleteTaskSync = () => {
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.delete-btn');
        if (target) {
            const taskDOM = target.parentNode.parentNode;
            const projectDOM = taskDOM.parentNode;
            projectDOM.removeChild(taskDOM);
        }
    })
}

// The edit a task button, happens before checking
const editTaskSync = () => {
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

// Validate changes to a task button, happens after editing
const checkTaskSync = () => {
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
    projectDOM.insertAdjacentHTML('beforeend',`
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
        `);
    projectDOM.appendChild(addTaskDOM);
}

// The "Task add (+)" button
const addTaskSync = () => {
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.add-btn');
        if (target) {
            callback(target, e);
        }
    })
}

// The "done" status button for tasks
const doneSync = () => {
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.done-status');
        if (target) {
            const taskDOM = target.parentNode;
            taskDOM.classList.toggle("todo-done");
            target.classList.toggle("done");
        }
    })
}

// Setting priority button, adds a border to the task
const prioritySync = () => {
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.priority');
        if (target) {
            const taskDOM = target.parentNode.parentNode;
            target.classList.toggle("important");
            taskDOM.classList.toggle("todo-card-important");
        }
    })
}

// Syncing the data model --DEPRECATED--
/*const projectsSync = () => {
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
}*/

// Add a project button, in the navbar (+)
const addProject = () => {
    navDOM.addEventListener("click", (e) => {
        const target = e.target.closest('.add-project');
        if (target) {
            const projectMenuParentDOM = document.querySelector('.page-content ul');
            idCount++;
            projectMenuParentDOM.removeChild(projectMenuParentDOM.lastChild);
            projectMenuParentDOM.insertAdjacentHTML('beforeend', `
            <li class ="project-option" id="op-${idCount}" contenteditable="true">
                New project
            </li>
            `);
            projectMenuParentDOM.appendChild(target);
            pageContentDOM.insertAdjacentHTML('beforeend', `
            <section class="project-todos hidden" id="${idCount}">
                <div class="btn add-btn"><i class="fas fa-plus fa-2x"></i></div>
            </section>
            `)
        }
    })
}

navSync();

addProject();

addTaskSync();

editTaskSync();
checkTaskSync();
deleteTaskSync();

doneSync();
prioritySync();
