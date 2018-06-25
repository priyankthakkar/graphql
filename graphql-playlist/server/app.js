const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// express-graphql helps express to understand graphql
// our aim is to use graphql as a middleware, which will be
// one supercharged endpoint to all incoming queries
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const app = express();
app.use(cors());

// establishing connection with mongo db
// I have been using mlab mongodb set up an online db, which is totally free uptp 500 mb.
// I will check-in the json file you can use to push data.
// you can use an offline mongodb as well
mongoose.connect("mongodb://<username>:<password>@ds161790.mlab.com:61790/graphql-priyank");
// graphql middleware - supercharged endpoint
// this middleware depends on graphql schema, which define how are your data will be organzied
app.use('/graphql', graphqlHTTP({
	schema
}));

app.listen(4000, () => {
	console.log('Application is listening at http://localhost:4000');
});
