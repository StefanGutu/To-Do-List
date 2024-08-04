import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

// ApolloClient - main class for interacting with a GraphQL server in ApolloClient
// InMemoryCache - powerful caching system that helps with performance and efficiency of my requests
// HttpLink - standard Apollo Link for making HTTP requests
// ApolloProvider - React component that wraps the app and provides the Apollo Client instance to the entire component tree

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:8080/v1/graphql',
        headers: {
            "x-hasura-admin-secret": "1111", // Ensure this matches your Hasura secret
        },
    }),
    cache: new InMemoryCache(),
});

// Function to wrap its children, making the client available to all components
const ApolloWrapper = ({ children }) => (
    <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
);

export default ApolloWrapper;


