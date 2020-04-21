export const Task = (name,description,dueDate,priority,done,pjID,id) => {
    return {
        name,
        description,
        dueDate,
        priority,
        done,
        pjID,
        id
    }
}

export const Project = (id,taskCount =0,title="New project") => {
    const tasks = [];
    const remove = (task) => {
        let i = tasks.indexOf(task);
        if (i && i > 0) {
            tasks.splice(i,1);
        }
    }
    return {
        taskCount,
        tasks,
        id,
        title,
        remove,
    };
}