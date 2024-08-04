import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import {DELETE_ALL_TASKS,DELETE_TASK,INSERT_TASKS} from './graphql/mutations';

function ToDoList({ initialTasks = [] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState("");

    const [deleteAllTasks] = useMutation(DELETE_ALL_TASKS);
    const [insertTasks] = useMutation(INSERT_TASKS);
    const [deleteTask] = useMutation(DELETE_TASK);

    function handleInputToNewTask(event) {
        setNewTask(event.target.value);
    }

    const handleAddTask = async() => { // allow me to use await that is necessary for deleting and adding tasks
        if (newTask.trim() !== "") { // check if the input is empty or consist only whitespace 
            const updatedTasks = [...tasks, { name: newTask, state: "new-in-list" }];
            const sortedTasks = sortTaskState(updatedTasks);
            setTasks(sortedTasks);
            setNewTask("");

            await updateTasks(sortedTasks);
        }
    };

    const handleRemoveTask = async(index) => {
        const name = tasks[index].name;
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);

        try{
            await deleteTask({ variables: { name } });
        }catch(error){
            console.error('Error deleting task:', error);
        }
    };


    const handleStateTaskChange = async(index, newState) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].state = newState;
        const sortedTasks = sortTaskState(updatedTasks);
        setTasks(sortedTasks);

        await updateTasks(sortedTasks);
    };


    function getStateTask(state) {
        switch (state) {
            case "Undone":
                return "state-undone";
            case "Done":
                return "state-done";
            case "InProgress":
                return "state-in-progress";
            default:
                return "new-task";
        }
    }


    function sortTaskState(tasks) {
        return tasks.sort((a, b) => {
            const order = ["new-in-list", "Undone", "InProgress", "Done"];
            return order.indexOf(a.state) - order.indexOf(b.state);
        });
    }

    async function updateTasks(sortedTasks){
        try{
            await deleteAllTasks();
            console.log('All tasks deleted successfully.');
        }catch(error){
            console.error('Error deleting tasks:', error);
        }
    
        try{
            await insertTasks({variables: {tasks: sortedTasks }});
            console.log('New tasks inserted successfully.');
        }catch(error){
            console.error('Error inserting tasks:', error);
        }
    }

    return (
        <>
            <div>
                <div className="to-do-list">
                    <h1> To Do List </h1>
                    <input
                        className="task-input"
                        type="text"
                        placeholder="Add a task"
                        value={newTask}
                        onChange={handleInputToNewTask}
                    />
                    <button className="add-button" onClick={handleAddTask}> Add </button>
                </div>
                <div className="task-list">
                    <ol>
                        {tasks.map((task, index) => (
                            <li key={index} className={getStateTask(task.state)}>
                                <span className="task-name"> {index + 1}. {task.name}</span>
                                <button className="in-progress-button" onClick={() => handleStateTaskChange(index, "InProgress")}>
                                    <i className="fa-solid fa-spinner"></i>
                                </button>
                                <button className="undone-button" onClick={() => handleStateTaskChange(index, "Undone")}>
                                    <i className="fa-regular fa-circle-xmark"></i>
                                </button>
                                <button className="done-button" onClick={() => handleStateTaskChange(index, "Done")}>
                                    <i className="fa-regular fa-circle-check"></i>
                                </button>
                                <button className="remove-button" onClick={() => handleRemoveTask(index)}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </>
    );
}

ToDoList.propTypes = {
    initialTasks: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        state: PropTypes.oneOf(['Undone', 'InProgress', 'Done', 'new-in-list'])
    }))
};

export default ToDoList;