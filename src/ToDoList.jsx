import React , {useState} from 'react'
import PropTypes from 'prop-types'

function ToDoList({initialTasks = []}){

    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState("");


    function handleInputToNewTask(event){
        setNewTask(event.target.value);
    }
    

    function handleAddTask(){
        if(newTask.trim() !== ""){ // check if the input is empty or consist only whitespace 
            setTasks(t => [...t, {name: newTask, state: "InProgress"}]);
            setNewTask("");
        }
    }

    //Function to remove an element from the index given as a parameter
    function handleRemoveTask(index){
        setTasks(tasks.filter((_,i) => i !== index));
    }

    //Function that will change the state of a task
    function handleStateTaskChange(index,newState){
        const updatedStateTasks = [...tasks];
        updatedStateTasks[index].state = newState;
        setTasks(updatedStateTasks);
    }

    //Function to get the state that will change the color of the bagkground inside the border of task-list
    function getStateTask(state){

        switch(state){
            case "Undone":
                return "state-undone";
            case "Done":
                return "state-done";
            case "InProgress":
                return "state-in-progress";
        }
    }


    return(
        <>  
            <div>

                <div className="to-do-list"> {/*used to make the border for the text TO DO LIST and the button Add task*/}

                    <h1> To Do List </h1>

                    <input  type="text" 
                            placeholder="Add a task"  
                            value={newTask} 
                            onChange={handleInputToNewTask}></input>

                    <button onClick={handleAddTask}> Add </button>

                </div>

                <div className="task-list">
                    <ol>
                        {tasks.map((task,index) => 
                            <li key = {index} className={getStateTask(task.state)}>

                                <span className = "task-name"> {task.name} </span>
                                
                                <div className="buttons-from-list">

                                    <button className="remove-button" onClick={() => handleRemoveTask(index)}>
                                        Remove
                                    </button>
                                    
                                    <select className="select-button" value={tasks.state} 
                                            onChange={(e) => handleStateTaskChange(index,e.target.value)}>
                                        <option className="Undone" value="Undone"> 
                                            Undone 
                                        </option>
                                        <option value="InProgress"> 
                                            In progress 
                                        </option>
                                        <option value="Done"> 
                                            Done 
                                        </option>
                                    </select>

                                </div>
                                
                            </li>
                        )}

                    </ol>
                </div>

            </div>

        </>
    );
}

//Specify the type that it's should get for name and state
ToDoList.propTypes = {
    initialTasks: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        state: PropTypes.oneOf(['Undone','InProgress','Done'])
    }))
}

export default ToDoList

