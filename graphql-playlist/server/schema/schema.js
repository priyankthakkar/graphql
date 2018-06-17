const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

var data = [
	{
		"id": "",
		"name": "",
		"genre": ""
	},
	{
		"id": "",
		"name": "",
		"genre": ""
	},
	{
		"id": "",
		"name": "",
		"genre": ""
	}
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		genre: {type: GraphQLString}
	});
});
