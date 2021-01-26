const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Icecream {
    _id: ID!
    flavor1: String!
    flavor2: String
    flavor3: String
    size: String!
    toppings: String!
    date: String!
    orderby: User!
}
type User {
    _id: ID!
    firstname: String!
    lastname: String!
    email: String!
    password: String
    createIcecreams: [Icecream!]
}
input IcecreamInput {
    flavor1: String!
    flavor2: String
    flavor3: String
    size: String!
    toppings: String!
    date: String!
}
input UserInput {
    firstname: String!
    lastname: String!
    email: String!
    password: String
}
type RootQuery {
    icecreams: [Icecream!]!
    users: [User!]!
}

type RootMutation {
    createIcecream(icecreamInput: IcecreamInput): Icecream
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);