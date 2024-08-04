const {gql} = require('apollo-server');

const typeDefs = gql`
    type Task{
        name: String!
        state: String!
    }
    
    type Query{
        tasks: [Task!]!
    }

    type Mutation{
        addTask(name:String!,state:String!): Task
        updateTask(name:String!,state:String!): Task
        deleteTask(id: Int!): Task
    }

    type Subscription{
        taskUpdated: Task
    }  
`;

module.exports = typeDefs;