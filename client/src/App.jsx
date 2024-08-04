import React, { useEffect, useState } from 'react';
import ToDoList from "./ToDoList.jsx";
import { useQuery } from '@apollo/client';
import {SHOW_TASKS} from './graphql/queries.jsx';


function App() {
    
    const {loading, error, data} = useQuery(SHOW_TASKS);

    if(loading){
        return <div>Loading...</div>; // display loading while data gets back from the server
    }
    if(error){
        return <div>Error: {error.message}</div> //display error 
    }

    return (
        <>
            <ToDoList initialTasks={data.tasks} />    
        </>
    );
}

export default App;