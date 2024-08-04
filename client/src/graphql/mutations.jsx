import { gql } from '@apollo/client';

//Function to delete only one task
const DELETE_TASK = gql`
  mutation deleteOneTask($name: String!) {
    delete_tasks(where: { name: { _eq: $name}}){
      affected_rows
    }
  }
`;

//Function to insert the sorted tasks
const INSERT_TASK = gql`
  mutation InsertTask($name: String!, $state: String!) {
    insert_tasks(objects: { name: $name, state: $state }) {
      returning {
        id
        name
        state
      }
    }
  }
`;

const UPDATE_TASK_STATE = gql`
  mutation UpdateTaskState($name: String!, $state: String!) {
    update_tasks(where: { name: { _eq: $name } }, _set: { state: $state }) {
      returning {
        id
        name
        state
      }
    }
  }
`;

export {
  DELETE_TASK,
  INSERT_TASK,
  UPDATE_TASK_STATE,
}
