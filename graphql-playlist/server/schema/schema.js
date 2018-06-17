const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

var data = [
	{
		"id": "1",
		"name": "",
		"genre": "fiction"
	},
	{
		"id": "2",
		"name": "",
		"genre": "fiction"
	},
	{
		"id": "3",
		"name": "",
		"genre": "sci-fi"
	}
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		genre: {type: GraphQLString}
	})
});

// We are defining a RootQuery here, where we mention
// What is the type we are querying?
// For e.g. here we querying BookType,
// also we mention, that book should be queried based on id 
// which is going to be of type String(GraphQLString to be precise)

// same RootQuery will look like
// book(id: '1') {
// 	name
// 	genre
// }
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				// place code here to get data from db/datasource

			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
