import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Create an HTTP link:
const httpLink = new HttpLink({
  uri: 'http://localhost:8080/v1/graphql',
  headers: {
    "x-hasura-admin-secret": "1111", // Ensure this matches your Hasura secret
  },
});

// Create a WebSocket link for subscriptions:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/v1/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": "1111", // Ensure this matches your Hasura secret
      },
    },
  },
});

// Use split to direct operations to the appropriate link:
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Create the Apollo Client:
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// Function to wrap its children, making the client available to all components
const ApolloWrapper = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

export default ApolloWrapper;


