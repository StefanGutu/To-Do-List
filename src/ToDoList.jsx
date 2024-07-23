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

                    <input  className="task-input"
                            type="text" 
                            placeholder="Add a task"  
                            value={newTask} 
                            onChange={handleInputToNewTask}></input>

                    <button className="add-button"
                            onClick={handleAddTask}> Add </button>

                </div>

                <div className="task-list">
                    <ol>
                        {tasks.map((task,index) => 
                            <li key = {index} className={getStateTask(task.state)}>


                                <span className = "task-name"> {index+1}. {task.name}</span>
                                
                                <button className="undone-button" onClick={(e) => handleStateTaskChange(index,"Undone")}>
                                    <i class="fa-regular fa-circle-xmark"></i>
                                </button>

                                <button className="done-button" onClick={(e) => handleStateTaskChange(index,"Done")}>
                                    <i class="fa-regular fa-circle-check"></i>
                                </button>

                                <button className="remove-button" onClick={() => handleRemoveTask(index)}>
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>

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

