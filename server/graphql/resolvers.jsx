const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const TASK_UPDATED = 'TASK_UPDATED';


const client = require('./db.jsx');

const RESOLVERS = {
    Query: {
        tasks: async () => {
            const res = await client.query('SELECT name, state FROM tasks');
            return res.rows;
        },
    },
    Mutation: {
        addTask: async (_, { name, state }) => {
            const res = await client.query(
                'INSERT INTO tasks(name, state) VALUES($1, $2) RETURNING name, state',
                [name, state]
            );
            const newTask = res.rows[0];
            pubsub.publish(TASK_UPDATED, { taskUpdated: newTask });
            return newTask;
        },
        updateTask: async (_, { name, state }) => {
            const res = await client.query(
                'UPDATE tasks SET state = $2 WHERE name = $1 RETURNING name, state',
                [name, state]
            );
            const updatedTask = res.rows[0];
            if (updatedTask) {
                pubsub.publish(TASK_UPDATED, { taskUpdated: updatedTask });
            }
            return updatedTask;
        },
        deleteTask: async (_, { id }) => {
            const res = await client.query(
                'DELETE FROM tasks WHERE id = $1 RETURNING name, state',
                [id]
            );
            const deletedTask = res.rows[0];
            if (deletedTask) {
                pubsub.publish(TASK_UPDATED, { taskUpdated: deletedTask });
            }
            return deletedTask;
        },
    },
    Subscription: {
        taskUpdated: {
            subscribe: () => pubsub.asyncIterator([TASK_UPDATED]),
        },
    },
};

module.exports = RESOLVERS;