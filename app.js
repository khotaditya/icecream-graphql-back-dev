const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Icecream = require('./models/icecream');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`

            type Icecream {
                _id: ID!
                flavor1: String!
                flavor2: String
                flavor3: String
                size: String!
                toppings: String!
                date: String!

            }
            type User {
                _id: ID!
                firstname: String!
                lastname: String!
                email: String!
                password: String
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
            }

            type RootMutation {
                createIcecream(icecreamInput: IcecreamInput): Icecream
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            icecreams: () =>{
                return Icecream.find().then(icecreams => {
                    return icecreams
                }).catch(err => {
                    console.log(err);
                });
            },
            createIcecream: async args => {
                try{
                    const icecream = new Icecream({
                        flavor1: args.icecreamInput.flavor1,
                        flavor2: args.icecreamInput.flavor2,
                        flavor3: args.icecreamInput.flavor3,
                        size: args.icecreamInput.size,
                        toppings: args.icecreamInput.toppings,
                        date: new Date(args.icecreamInput.date),
                        orderby: "600efada2b5cf14f866fdb26"        
                    });
                    const savedIcecream = await icecream.save();

                    const user = await User.findById("600efada2b5cf14f866fdb26");
                    if(!user){
                        throw new Error("No user found");
                    }else{
                        await user.createIcecreams.push(savedIcecream);  
                        await user.save(); 

                        return savedIcecream;
                    }
                }catch(err){
                    throw err;
                }
            },
            
            createUser: async args => {
                try{
                    const email = args.userInput.email;
                    
                    const existUser = await User.findOne({email});
                    if(existUser){
                        throw new Error('User already exist')
                    }else{
                        const user = new User({
                            firstname: args.userInput.firstname,
                            lastname: args.userInput.lastname,
                            email: args.userInput.email,
                            password: bcrypt.hashSync(args.userInput.password, 12)    
                        });
                        const res = await user.save();
                        return { ...res._doc, password: null};            
                    }
                    
                }catch(err){
                    throw err;
                }
                
            }      
        },
        graphiql: true
    })
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tikpi.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() =>{
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
