const bcrypt = require('bcryptjs');

const Icecream = require('../../models/icecream');
const User = require('../../models/user');

const getIcecreamByIds = async icecreamIds => {
    try{
        const getAllIc = await Icecream.find({ _id: { $in: icecreamIds } });
        //console.log(getAllIc);
        getAllIc.map(icecream => {
            return {
                ...icecream._doc,
                _id: icecream.id,
                date: new Date(icecream.date).toISOString(),
                orderby: getUserById.bind(this, icecream.orderby)
            };
        });
        return getAllIc;
    }catch(err){
        throw err;
    }
}; 

const getUserById = async userId => {
    try{
        const getUser = await User.findById(userId);
        return {
            ...getUser._doc,
            _id: getUser.id,
            createIcecreams: getIcecreamByIds.bind(this, getUser._doc.createIcecreams)
        };
    }catch(err){
        throw err;
    }
};
module.exports = {
    icecreams: async () =>{
        try{
            const icecreams = await Icecream.find();
            //return icecreams;
            return icecreams.map(icecream => {
                return {
                    ...icecream._doc,
                    _id: icecream.id,
                    date: new Date(icecream.date).toISOString(),
                    orderby: getUserById.bind(this, icecream._doc.orderby)
                };
            });
        }catch(err){
            console.log(err);
        };
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
    createIcecream: async args => {
        try{
            const icecream = new Icecream({
                flavor1: args.icecreamInput.flavor1,
                flavor2: args.icecreamInput.flavor2,
                flavor3: args.icecreamInput.flavor3,
                size: args.icecreamInput.size,
                toppings: args.icecreamInput.toppings,
                date: new Date(args.icecreamInput.date),
                orderby: "600ff0394a44d1593dc189e0"        
            });
            const savedIcecream = await icecream.save();

            const user = await User.findById("600ff0394a44d1593dc189e0");
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
};