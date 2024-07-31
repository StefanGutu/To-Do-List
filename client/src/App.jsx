import React, { useEffect, useState } from 'react';
import ToDoList from "./ToDoList.jsx";
import axios from "axios";

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch tasks from the backend
        axios.get('http://localhost:5000/api/tasks') // get request to backend server
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the tasks!', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>; // display loading while data gets back from the server
    }

    return (
        <>
            <ToDoList initialTasks={tasks} />    
        </>
    );
}

export default App;