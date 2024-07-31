import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function ToDoList({ initialTasks = [] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState("");

    function handleInputToNewTask(event) {
        setNewTask(event.target.value);
    }

    const handleAddTask = () => {
        if (newTask.trim() !== "") { // check if the input is empty or consist only whitespace 
            const updatedTasks = [...tasks, { name: newTask, state: "new-in-list" }];
            const sortedTasks = sortTaskState(updatedTasks);
            setTasks(sortedTasks);

            // Send the sorted tasks to the backend
            axios.post('http://localhost:5000/api/tasks/sorted', sortedTasks)
                .then(response => console.log(response.data))
                .catch(error => console.error('There was an error sending the tasks!', error));

            setNewTask("");
        }
    };

    const handleRemoveTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        const sortedTasks = sortTaskState(updatedTasks);
        setTasks(sortedTasks);

        // Update the backend with the new sorted tasks
        axios.post('http://localhost:5000/api/tasks/sorted', sortedTasks)
            .then(response => console.log(response.data))
            .catch(error => console.error('There was an error sending the tasks!', error));
    };


    const handleStateTaskChange = (index, newState) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].state = newState;
        const sortedTasks = sortTaskState(updatedTasks);
        setTasks(sortedTasks);

        // Update the backend with the new sorted tasks
        axios.post('http://localhost:5000/api/tasks/sorted', sortedTasks)
            .then(response => console.log(response.data))
            .catch(error => console.error('There was an error sending the tasks!', error));
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