const graphql = require('graphql');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID 
} = graphql;

// dummu data, down the line this will be replaced by mongo db

var data = [
	{
		"id": "1",
		"name": "Name of the Wind",
		"genre": "fiction"
	},
	{
		"id": "2",
		"name": "The Final Empire",
		"genre": "fiction"
	},
	{
		"id": "3",
		"name": "The Long Earth",
		"genre": "sci-fi"
	}
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		genre: {type: GraphQLString}
	})
});

// We are defining a RootQuery here, where we mention
// What is the type we are querying?
// For e.g. here we querying BookType,
// also we mention, that book should be queried based on id 
// which is going to be of type String(GraphQLString to be precise)

// same RootQuery will look like (while using string, use double quotes always)
// book(id: "1") {
// 	name
// 	genre
// }
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			// an import thing to notice here is, the id type for args was GraphQLString earlier, which supports only String as an arg
			// but we are going to replace it with GraphQLID, which is more adaptive while taking arguments
			// now you can pass id as string or integer but GraphQLID will adapat and support both the type of args
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// place code here to get data from db/datasource

				// This statement here, iterates through dummy data placed above
				// and finds a book with given id
				return data
					.find(book => book.id === args.id);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
