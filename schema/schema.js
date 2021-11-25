// in the schema folder you 1st create a schema, then relationship, then root queries
const graphql = require('graphql')
const _ = require('lodash');
const Book = require('../models/bookModel')
const Author = require('../models/authorModel')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql; // for the schema structure

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
            resolve(parent, args) {
                // return _.find(authors, { id: parent.authorId })
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
                // return _.filter(books, { authorId: parent.id })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({ // root query
    name: 'RootQueryType',
    fields: {
        book: { // querying a particular book
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) { // code to get data from db / other source (sql or nosql)
                // return _.find(books, { id: args.id })
            }
        },
        author: { // querying a specific author
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id })
            }
        },
        books: { // querying all books
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
            }
        },
        authors: { // querying all authors
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
            }
        }
    }
})

const Mutation = new GraphQLObjectType({ // for all the 'CRUD' operations
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType, // what are we adding an author -> type is AuthorType created above
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                let author = new Author({ name: args.name, age: args.age })
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID },
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