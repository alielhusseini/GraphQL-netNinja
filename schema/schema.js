const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString } = graphql; // like the schema structure in the mongoose

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        }
    })
})