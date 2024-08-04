import {gql} from '@apollo/client';

const SHOW_TASKS = gql`
    query GetTasks {
        tasks(order_by: { state: asc }) {
            name
            state
        }
    }
`;

export {
    SHOW_TASKS,
}
    
