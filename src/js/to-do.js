export const Task = (name,description,dueDate,priority,done) => {
    const setName = (newName) => {
        name = newName;
    }

    const setDescription = (newDescription) => {
        description = newDescription;
    }

    const setDueDate = (newDueDate) => {
        dueDate = newDueDate;
    }

    const changePriority = () => {
        priority = !priority;
    }

    const changeDone = () => {
        done = !done;
    }

    const getName = () => {
        return name;
    }

    const getDescription = () => {
        return description;
    }

    const getDueDate = () => {
        return dueDate;
    }

    const isPriority = () => {
        return priority;
    }

    const isDone = () => {
        return done;
    }

    return {setName,setDescription,setDueDate,changePriority,changeDone, getName,getDescription,getDueDate,isPriority, isDone}
}

export const Project = (id) => {
    const todos = [];
    const add = (todo) => {
        todos.push(todo);
    }
    const remove = (todo) => {
        let i = todos.indexOf(todo);
        if (i && i > 0) {
            todos.splice(i,1);
        }
    }

    const getTodos = () => {
        return todos;
    }

    const getId = () => {
        return id;
    }

    return {getTodos,remove,add,getId};
}