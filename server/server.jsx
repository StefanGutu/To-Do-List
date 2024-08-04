const { ApolloServer } = require('apollo-server');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');

const typeDefs = require('./graphql/typeDefs.jsx');
const resolvers = require('./graphql/resolvers.jsx');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        path: '/graphql', // Path where subscriptions are handled
    },
    plugins: [{
        async serverWillStart() {
            return {
                async drainServer() {
                    if (subscriptionServer) {
                        subscriptionServer.close();
                    }
                }
            };
        }
    }],
});

const httpServer = createServer(server);

let subscriptionServer = null;

server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);

    // Initialize the subscription server
    subscriptionServer = SubscriptionServer.create({
        schema: server.schema,
        execute,
        subscribe,
        onConnect: () => console.log("Connected to websocket"),
        onDisconnect: () => console.log("Disconnected from websocket"),
    }, {
        server: httpServer,
        path: server.graphqlPath,
    });
});

