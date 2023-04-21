const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
/*const typeDefs = gql`
type Query {
    hello: String
} `;*/
const typeDefs = require("./schema");

// Provide resolver functions for your schema fields
/*const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};*/
const resolvers = require("./resolvers");

let world = require("./world");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
        world: world
    })
});

const app = express();

app.use(express.static('public'));

server.start().then( res => {
    server.applyMiddleware({app});
    app.listen({port: 4000}, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
});