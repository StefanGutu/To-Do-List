import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import { useSubscription } from '@apollo/client';
import {DELETE_TASK,INSERT_TASK,UPDATE_TASK_STATE} from './graphql/mutations';
import { TASK_UPDATED_SUBSCRIPTION } from './graphql/subscription.jsx'; // Update import path if needed

function ToDoList({ initialTasks = [] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState("");

    const [insertTask] = useMutation(INSERT_TASK);
    const [deleteTask] = useMutation(DELETE_TASK);
    const [updateTaskState] = useMutation(UPDATE_TASK_STATE);

    // Subscription to task updates
    const { data: subscriptionData } = useSubscription(TASK_UPDATED_SUBSCRIPTION);

    useEffect(() => {
        if (subscriptionData && subscriptionData.taskUpdated) {
            const updatedTask = subscriptionData.taskUpdated;
            setTasks(prevTasks => {
                const taskIndex = prevTasks.findIndex(task => task.id === updatedTask.id);
                if (taskIndex > -1) {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[taskIndex] = updatedTask;
                    return updatedTasks;
                }
                return [...prevTasks, updatedTask];
            });
        }
    }, [subscriptionData]);

    function handleInputToNewTask(event) {
        setNewTask(event.target.value);
    }

    const handleAddTask = async() => { // allow me to use await that is necessary for deleting and adding tasks
        if (newTask.trim() !== "") { // check if the input is empty or consist only whitespace 
            try {
                await insertTask({
                    variables: { name: newTask, state: "new-in-list" }
                });

                const updatedTasks = [...tasks, { name: newTask, state: "new-in-list" }];
                const sortedTasks = sortTaskState(updatedTasks);
                setTasks(sortedTasks);
                setNewTask("");

            } catch (error) {
                console.error('Error inserting task:', error);
            }
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
        const name = tasks[index].name;
        // Create a new array with updated task state
        const updatedTasks = tasks.map((task, i) => 
            i === index ? { ...task, state: newState } : task
        );
    
        // Sort the tasks after update
        const sortedTasks = sortTaskState(updatedTasks);

        try {
            await updateTaskState({ variables: { name, state: newState } });
            setTasks(sortedTasks);
        } catch (error) {
            console.error('Error updating tasks:', error);
            
        }
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
            // Compare states alphabetically
            return a.state.localeCompare(b.state);
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