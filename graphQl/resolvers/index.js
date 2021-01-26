const bcrypt = require('bcryptjs');

const Icecream = require('../../models/icecream');
const User = require('../../models/user');
const Order = require('../../models/order');

const getIcecreamByIds = async icecreamIds => {
    try{
        const getAllIc = await Icecream.find({ _id: { $in: icecreamIds } });
        //console.log(getAllIc);
        return getAllIc.map(icecream => {
            return {
                ...icecream._doc,
                _id: icecream.id,
                date: new Date(icecream.date).toISOString(),
                orderby: getUserById.bind(this, icecream.orderby)
            };
        });
        
    }catch(err){
        throw err;
    }
}; 

const singleIcecream = async icecreamId => {
    try{
        const icecream = await Icecream.findById(icecreamId);
        return {
            ...icecream._doc,
            orderby: getUserById.bind(this, icecream.orderby)
        }
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
    orders: async () =>{
        try{
           const orders = await Order.find();
           return orders.map(order => {
               return {
                   ...order._doc,
                   user: getUserById.bind(this, order._doc.user),
                   icecream: singleIcecream.bind(this, order._doc.icecream), 
                   createdAt: new Date(order.createdAt).toISOString(),
                   updatedAt: new Date(order.updatedAt).toISOString(),
               };
           }); 
        }catch(err){
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
    orderIcecream: async args => {
        try{
            const getIcecream = await Icecream.findOne({_id: args.icecreamId}); 
            const order = new Order({
              user: '600ff0394a44d1593dc189e0',
              icecream: getIcecream 
           });
           const result = await order.save();
           return {
                ...result._doc,
                user: getUserById.bind(this, result._doc.user),
                icecream: singleIcecream.bind(this, result._doc.icecream), 
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString(),
           } ;
        }catch(err){
            throw err;
        }
    },
    cancelOrder: async args => {
        try{
            const order = await Order.findById(args.orderId).populate('icecream');
            const icecream = {
                ...order.icecream._doc,
                orderby: getUserById.bind(this, order.icecream._doc.orderby)
            };
            await Order.deleteOne({ _id: args.orderId});
            return icecream;
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