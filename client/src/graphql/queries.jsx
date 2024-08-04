import {gql} from '@apollo/client';

const SHOW_TASKS = gql`
    query GetTasks{
        tasks{
            id
            name
            state
        }
    }

`;

export {
    SHOW_TASKS,
}
    
