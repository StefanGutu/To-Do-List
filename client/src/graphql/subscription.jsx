import { gql } from '@apollo/client';

export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription OnTaskUpdated {
    taskUpdated {
      name
      state
    }
  }
`;