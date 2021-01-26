const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Order {
    _id: ID!,
    icecream: Icecream!
    user: User!
    createdAt: String!
    updatedAt: String!
}

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
    orders: [Order!]!
}

type RootMutation {
    createIcecream(icecreamInput: IcecreamInput): Icecream
    createUser(userInput: UserInput): User
    orderIcecream(icecreamId: ID!): Order!
    cancelOrder(orderId: ID!): Icecream!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);