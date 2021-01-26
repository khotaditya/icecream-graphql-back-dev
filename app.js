const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');

const app = express();

const graphiQlSchema = require('./graphQl/schema/index');
const graphiQlResolver = require('./graphQl/resolvers/index');

app.use(bodyParser.json());

//API end point
app.use('/graphql',
    graphqlHttp({
        schema: graphiQlSchema,
        rootValue: graphiQlResolver,
        graphiql: true
    })
);

//Mongo DB connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tikpi.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() =>{
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
