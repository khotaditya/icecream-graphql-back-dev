const bcrypt = require('bcryptjs');
const { getIcecreamByIds } = require('./common');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    login: async ({email, password}) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user){
                throw new Error('User does not exist');
            }
            const checkPass = await bcrypt.compare(password, user.password);
            if (!checkPass){
                throw new Error('Password is incorrect!');
            }
            const token = jwt.sign({userId: user.id, email: user.email}, 'icecreamsecretkey', {expiresIn: '1h'});

            return { userId: user.id, token: token, tokenExpiration: 1};

        } catch (err){
            throw err;
        }
    },
    users: async () =>{
        try{
            const users = await User.find();
            //return users;
             return users.map(user => {
                 return {
                     ...user._doc,
                     _id: user.id,
                     createIcecreams: getIcecreamByIds.bind(this, user._doc.createIcecreams)
                 };
             });
        }catch(err){
            console.log(err);
        };
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
};