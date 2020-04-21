import * as model from './model';
import '../css/styles.css';
import * as Cookies from 'js-cookie';


// Static DOM Elements
const pageContentDOM = document.querySelector('.page-content');
const navDOM = document.querySelector('nav');
const navigation = document.body;

// Universal id counter;
let idCount = (Cookies.get('idCount')) ? parseInt(Cookies.get('idCount')) : 0;
let projectArray;
let projectBinders = [];

window.projects = projectBinders;
// Proxy objects for data binding
const binderProject = (project) => {
    return new Proxy(project, {
        set(target, property, value) {
            if (property !== 'title' && property !== 'taskCount' && property !== 'tasks') {
                throw new ReferenceError(property + ' is nonexistent or inchangeable!');
            } else if (property !== 'tasks'){
                target[property] = value;
                const projectNavigationDOM = document.getElementById(`op-${project.id}`);
                projectNavigationDOM.textContent = project.title;
                return true;
            } else {
                target[property] = value;
                return true;
            }
        }
    })
}

const binderTask = (task) => {
    return new Proxy(task, {
        set(target, property, value) {
            if (property === 'name' || property === 'description') {
                target[property] = value;
                const propertyDOM = document.getElementById(`${target.pjID}-${target.id}`).querySelector(`[data-bind=${property}]`);
                propertyDOM.textContent = value;
                return true;
            } else if (property === 'priority') {
                target[property] = value;
                const taskDOM = document.getElementById(`${target.pjID}-${target.id}`);
                taskDOM.classList.toggle("todo-card-important");
                return true;
            } else if (property === 'done') {
                target[property] = value;
                const taskDOM = document.getElementById(`${target.pjID}-${target.id}`);
                taskDOM.classList.toggle("todo-done");
                return true;
            }
        }
    })
}

const updateProject = () => {
    navDOM.addEventListener("keyup", (e) => {
        const target = e.target;
        if (target.matches('.project-option')) {
            const projectId = parseInt(target.id.split("-")[target.id.split("-").length - 1]);
            let project = null;
            projectBinders.forEach((pr) => {
                if (parseInt(pr.id) === projectId) {
                    project = pr;
                }
            })
            project.title = target.textContent;
        }
    })
}

const updateTask = (property) => {
    let taskDOM;
    let taskProjectId;
    let taskOwnId;
    if (property === 'name' || property === 'description') {
        navigation.addEventListener("keyup", (e) => {
            const target = e.target;
            if (target.matches(`[data-bind="${property}"]`)) {
                taskDOM = target.closest('.todo-card');
                taskProjectId = parseInt(taskDOM.id.split("-")[0]);
                taskOwnId = parseInt(taskDOM.id.split("-")[taskDOM.id.split("-").length - 1]);
                let project = null;
                projectBinders.forEach((pr) => {
                    if (parseInt(pr.id) === taskProjectId) {
                        project = pr;
                    }
                })
                let task = null;
                project.tasks.forEach((ts) => {
                    if (parseInt(ts.id) === taskOwnId) {
                        task = ts;
                    }
                })
                task[property] = target.textContent;
            }
        })
    } else if (property === 'priority') {
        navigation.addEventListener("click",(e)=> {
            const target = e.target.closest('.priority');
            if (target) {
                taskDOM = target.closest('.todo-card');
                taskDOM.classList.toggle('todo-card-important');
                console.log(taskDOM);
                taskProjectId = parseInt(taskDOM.id.split("-")[0]);
                taskOwnId = parseInt(taskDOM.id.split("-")[taskDOM.id.split("-").length - 1]);
                let project = null;
                projectBinders.forEach((pr) => {
                    if (parseInt(pr.id) === taskProjectId) {
                        project = pr;
                    }
                })
                let task = null;
                project.tasks.forEach((ts) => {
                    if (parseInt(ts.id) === taskOwnId) {
                        task = ts;
                    }
                })
                task.priority = !task.priority;
            }
        })
    } else if (property === 'done') {
        navigation.addEventListener("click",(e)=> {
            const target = e.target.closest('.done-status');
            if (target) {
                taskDOM = target.closest('.todo-card');
                taskDOM.classList.toggle('todo-done');
                console.log(taskDOM);
                taskProjectId = parseInt(taskDOM.id.split("-")[0]);
                taskOwnId = parseInt(taskDOM.id.split("-")[taskDOM.id.split("-").length - 1]);
                let project = null;
                projectBinders.forEach((pr) => {
                    if (parseInt(pr.id) === taskProjectId) {
                        project = pr;
                    }
                })
                let task = null;
                project.tasks.forEach((ts) => {
                    if (parseInt(ts.id) === taskOwnId) {
                        task = ts;
                    }
                })
                task.done = !task.done;
            }
        })
    }
}

const renderBinderToDOM = () => {
    const projectMenuParentDOM = document.querySelector('.page-content ul');
    const addProjectBtn = projectMenuParentDOM.querySelector('.add-project');
    projectMenuParentDOM.removeChild(addProjectBtn);
    projectBinders.forEach(pr => {
/*
            console.log(pr.title);
*/
            projectMenuParentDOM.insertAdjacentHTML('beforeend', `
            <li class ="project-option" id="op-${pr.id}" contenteditable="true">
                ${pr.title}
            </li>
            `);
            pageContentDOM.insertAdjacentHTML('beforeend', `
            <section class="project-todos hidden" id="${pr.id}" task-count="${pr.taskCount}">
            </section>`);
            let currProjectDOM = pageContentDOM.querySelectorAll('.project-todos');
            currProjectDOM = currProjectDOM[currProjectDOM.length - 1];
            pr.tasks.forEach(ts => {
                let priorityStatus = (ts.priority) ? "todo-card-important" : "";
                let doneStatus = (ts.done) ? "todo-done" : "";
                currProjectDOM.insertAdjacentHTML('beforeend', `
            <div class="todo-card ${priorityStatus} ${doneStatus}" id="${ts.pjID}-${ts.id}">
            <h3 data-bind="name">${ts.name}</h3>
            <div class="btn-wrapper" style="grid-area: edit;justify-self: end;display: flex; justify-content: end">
            <div class="btn check-btn hidden"><i class="fas fa-check"></i></div>
            <div class="btn edit-btn"><i class="fas fa-edit"></i></div>
            <span class="btn priority important"><i class="fas fa-exclamation"></i></span>
            <div class="btn delete-btn"><i class="fas fa-trash"></i></div>
            </div>
            <p data-bind="description">
                ${ts.description}
            </p>
            <span class="date-due" data-bind="dueDate">01/01/1970</span>
            <span class="btn done-status" data-bind="priority"><i class="fas fa-check"></i></span>
           </div>
        `)
            })
            currProjectDOM.insertAdjacentHTML('beforeend', `<div class="btn add-btn"><i class="fas fa-plus fa-2x"></i></div>`);
        }
    )

    projectMenuParentDOM.appendChild(addProjectBtn);
}

// Deselecting every project but the one clicked
const navSync = () => {
    navDOM.addEventListener("click", (e) => {
        const target = e.target.closest('.project-option');
        if (target) {
            const projectNavigationAll = document.querySelectorAll('.project-option');
            const projectNavigationId = target.id[target.id.length - 1];
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
const filtercallback = (task,pjID,id) => {
    return !(parseInt(task.pjID) === parseInt(pjID) && parseInt(task.id) === parseInt(id));
}

const deleteTaskSync = () => {
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.delete-btn');
        if (target) {
            // DOM stuff
            const taskDOM = target.parentNode.parentNode;
            const projectDOM = taskDOM.parentNode;
            projectDOM.removeChild(taskDOM);

            // Data binder stuff;
            const taskProjectId = parseInt(taskDOM.id.split("-")[0]);
            const taskOwnId = parseInt(taskDOM.id.split("-")[taskDOM.id.split("-").length - 1]);
            let project = null;
            projectBinders.forEach((pr) => {
                if (parseInt(pr.id) === taskProjectId) {
                    project = pr;
                }
            })
            project.tasks = project.tasks.filter((ts) => filtercallback(ts,taskProjectId,taskOwnId));
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
const callback = (addTaskDOM, e,) => {
    const projectDOM = addTaskDOM.parentNode;
    const projectTaskCount = parseInt(projectDOM.getAttribute('task-count')) + 1;
    projectDOM.setAttribute('task-count', projectTaskCount);
    projectDOM.removeChild(addTaskDOM);
    projectDOM.insertAdjacentHTML('beforeend', `
         <div class="todo-card" id="${projectDOM.id}-${projectTaskCount}">
            <h3 data-bind="name">New task</h3>
            <div class="btn-wrapper" style="grid-area: edit;justify-self: end;display: flex; justify-content: end">
            <div class="btn check-btn hidden"><i class="fas fa-check"></i></div>
            <div class="btn edit-btn"><i class="fas fa-edit"></i></div>
            <span class="btn priority important"><i class="fas fa-exclamation"></i></span>
            <div class="btn delete-btn"><i class="fas fa-trash"></i></div>
            </div>
            <p data-bind="description">
                Description
            </p>
            <span class="date-due" data-bind="dueDate">01/01/1970</span>
            <span class="btn done-status" data-bind="priority"><i class="fas fa-check"></i></span>
        </div>
        `);
    projectDOM.appendChild(addTaskDOM);
}

// The "Task add (+)" button
const addTaskSync = () => {
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.add-btn');
        if (!target) {
            return;
        }
        // DOM stuff
        callback(target, e);

        // Data binder stuff
        const projectDOM = target.closest('.project-todos');
        const projectDOMid = parseInt(projectDOM.id);
        const projectDOMcount = parseInt(projectDOM.getAttribute('task-count'));
        let project = null;
        projectBinders.forEach((pr) => {
            if (parseInt(pr.id) === projectDOMid) {
                project = pr;
                pr.taskCount = projectDOMcount;
            }
        })
        const task = model.Task('New task', 'Description', '01/01/1970', false, false, projectDOMid, projectDOMcount);
        const taskBinder = binderTask(task);
        project.tasks.push(taskBinder);
    })
}

// The "done" status button for tasks
const doneSync = () => {
    // DOM stuff
    navigation.addEventListener("click", (e) => {
        const target = e.target.closest('.done-status');
        if (target) {
            const taskDOM = target.parentNode;
            taskDOM.classList.toggle("todo-done");
            target.classList.toggle("done");
        }
    })

    // Data binder stuff

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

// Add a project button, in the navbar (+)
const addProject = () => {
    navDOM.addEventListener("click", (e) => {
        const target = e.target.closest('.add-project');
        if (target) {
            // State stuff
            const newProjectBinder = binderProject(model.Project(idCount));
            projectBinders.push(newProjectBinder);

            // DOM stuff
            const projectMenuParentDOM = document.querySelector('.page-content ul');
            projectMenuParentDOM.removeChild(projectMenuParentDOM.lastChild);
            projectMenuParentDOM.insertAdjacentHTML('beforeend', `
            <li class ="project-option" id="op-${idCount}" contenteditable="true">
                New project
            </li>
            `);
            projectMenuParentDOM.appendChild(target);
            pageContentDOM.insertAdjacentHTML('beforeend', `
            <section class="project-todos hidden" id="${idCount}" task-count="0">
                <div class="btn add-btn"><i class="fas fa-plus fa-2x"></i></div>
            </section>
            `)
            idCount++;
        }
    })
}
///
idCount = (Cookies.get('idCount')) ? parseInt(Cookies.get('idCount')) : 0;
projectArray = (Cookies.get('projects')) ? JSON.parse(Cookies.get('projects')) : [];
if (JSON.stringify(projectArray) !== "[]") {
    projectArray.forEach((pr) => {
        const project = binderProject(model.Project(pr.id, pr.taskCount, pr.title));
        pr.tasks.forEach((ts) => {
            const task = binderTask(model.Task(ts.name, ts.description, ts.dueDate, ts.priority, ts.done, ts.pjID, ts.id));
            project.tasks.push(task);
        })
        projectBinders.push(project);
    })
}

const render = () => {
    navSync();

    addProject();

    addTaskSync();

    editTaskSync();
    checkTaskSync();
    deleteTaskSync();

    doneSync();
    prioritySync();

    updateTask('name');
    updateTask('description');
    updateTask('priority');
    updateTask('done');
    updateProject();

    renderBinderToDOM();
}

render();

setInterval(() => {
    Cookies.set("idCount", idCount);
    Cookies.set("projects", JSON.stringify(projectBinders))
}, 1000);