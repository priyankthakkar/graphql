const graphql = require('graphql');
const Book = require('../models/book');
const Author  =require('../models/author');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;

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
				// Here Author is a mongoose schema to interact with AuthorType
				// When we use findById() method on mongoos schema for Author
				// It retrieve an author with give id
				return Author
						.findById(parent.authorId);
			}
		}
	})
});

// Now relationship between BookType and AuthorType is bi-directional
// For books, we are using GraphQLList instead of plain BookType because author can have more than one book
// Also to notice, we are now using filter method under resolve() method because find() returns only one result
// while filter() can yield multiple elements
// If you use the below query for author with id: 3 from dummy data, it should yield an author with 3 books
//	{
//		author(id: 3) {
//			id
//			name
//			age
//			books {
//				name
//				genre
//			}
//		}
//	}

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// Here Book is a mongoose schema to interact with BookType
				// When we use find() method on mongoos schema for Book and we pass the author id parameter
				// It retrieve all the books by provided author id
				return Book.find({authorId: parent.id});
			}
		}
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
				// Here Book is a mongoose schema to interact with BookType
				// When we use findById() method on mongoos schema for Book
				// It retrieve a book with give id
				return Book
						.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// Here Author is a mongoose schema to interact with AuthorType
				// When we use findById() method on mongoos schema for Author
				// It retrieve an author with give id
				return Author
						.findById(args.id);
			}
		},
		// With the help of this new root query, we should be able to query all the books available within books list
		// also this query will leverage the relation of plain BookType with AuthorType
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// When we execute find() method on mongoose schema for Book without parameters
				// It retrieves all the books from datastore
				return Book.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				// When we execute find() method on mongoose schema for Author without parameters
				// It retrieves all the authors from datastore
				return Author.find({});
			}
		}
	}
});

// As RootQueries depict, in how many different way we can query the data
// Simillarly, Mutation here defines how we can add data to datastore

// For the mutation, we can now see, mandatory fields are now wrapped with GraphQLNonNull
// Any fields wrapped with this, client must pass them while mutating the data.
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		// mutation to add a single author
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age
				});

				return author.save();
			}
		},
		// mutation to add a single book
		addBook: {
			type: BookType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				genre: {type: new GraphQLNonNull(GraphQLString)},
				authorId: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});

				return book.save();
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
