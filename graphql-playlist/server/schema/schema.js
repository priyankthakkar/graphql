const graphql = require('graphql');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLInt 
} = graphql;

// dummy data, down the line this will be replaced by mongo db

const books = [
	{
		"id": "1",
		"name": "Name of the Wind",
		"genre": "fiction",
		"authorId": "1"
	},
	{
		"id": "2",
		"name": "The Final Empire",
		"genre": "fiction",
		"authorId": "2"
	},
	{
		"id": "3",
		"name": "The Long Earth",
		"genre": "sci-fi",
		"authorId": "3"
	}
];

const authors = [
	{
		"name": "Patrick Rothfuss",
		"age": 44,
		"id": "1"
	},
	{
		"name": "Brandon Sanderson",
		"age": 42,
		"id": "2"
	},
	{
		"name": "Terry Pratchett",
		"age": 66,
		"id": "3"
	},
]

// Now, our aim here is to retrieve a corresponding author of the book when user queries a speicfic book
// to reiterate, we will send complete author information rather than merely returning an authorId
// This change will now support a query like,
//	{
//		book(id: 3) {
//			name
//			genre
//			id
//			author {
//				name
//			}
//		}
//  }

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		author: { 
			type: AuthorType,
			resolve(parent, args) {
				return authors
						.find(author => author.id === parent.authorId);
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt }
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
				return books
						.find(book => book.id === args.id);
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return authors
						.find(author => author.id === args.id);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
