// in the schema folder you 1st create a schema with relationship(if any), then root queries & mutations
const graphql = require('graphql')
const Book = require('../models/bookModel')
const Author = require('../models/authorModel')
    // const _ = require('lodash');

const { GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt, GraphQLList } = graphql; // for the schema structure

// unlike models in mongoose here you do need to create an id for the schema
const BookType = new GraphQLObjectType({ // book schema
    name: 'Book',
    fields: () => ({ // in schema, the fields must be wrapped in a function since the function fires when all of the code in the file is read (from top to bottom), only then the created types (BookType, AuthorType) would be defined.  
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: { // relationship
            type: AuthorType,
            resolve(parent, args) { // the parent here is the Book model, we don't need the authorId as in the model since we'll get the author as AuthorType instead
                return Author.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({ // author schema
    name: 'Author',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: { // relationship
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({ authorId: parent.id })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({ // root query (Read/Get)
    name: 'RootQueryType',
    fields: {
        book: { // querying a particular book
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) { // code to get data from db / other source (sql or nosql)
                return Book.findById(args.id) // the returned Book model will fill out the schema in the BookType and will be the parent
            }
        },
        author: { // querying a specific author
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id)
            }
        },
        books: { // querying all books
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find()
            }
        },
        authors: { // querying all authors
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find()
            }
        }
    }
})

const Mutation = new GraphQLObjectType({ // for the 'CRUD' operations without the Read
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType, // what are we adding an author -> type is AuthorType created above
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({ name: args.name, age: args.age })
                return author.save() // the retured model will fill out the type that's chosen as its schema
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let book = new Book({ name: args.name, genre: args.genre, authorId: args.authorId })
                return book.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})