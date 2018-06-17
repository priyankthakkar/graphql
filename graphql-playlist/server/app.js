const express = require('express');
// express-graphql helps express to understand graphql
// our aim is to use graphql as a middleware, which will be
// one supercharged endpoint to all incoming queries
const graphqlHTTP = require('express-graphql');

const app = express();

// graphql middleware - supercharged endpoint
// this middleware depends on graphql schema, which define how are your data will be organzied
app.use('/graphql', graphqlHTTP({

}));
app.listen(4000, () => {
	console.log('Application is listening at http://localhost:4000');
});
