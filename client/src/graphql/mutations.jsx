import { gql } from '@apollo/client';

//Function to delete all tasks
const DELETE_ALL_TASKS = gql`
  mutation deleteAllTasks {
    delete_tasks(where: {}) {
      affected_rows
    }
  }
`;

//Function to delete only one task
const DELETE_TASK = gql`
  mutation deleteOneTask($name: String!) {
    delete_tasks(where: { name: { _eq: $name}}){
      affected_rows
    }
  }
`;

//Function to insert the sorted tasks
const INSERT_TASKS = gql`
  mutation insertTasks($tasks: [tasks_insert_input!]!) {
    insert_tasks(objects: $tasks) {
      affected_rows
    }
  }
`;

export {
  DELETE_ALL_TASKS,
  DELETE_TASK,
  INSERT_TASKS,
}
