const { dateToString } = require('../../helpers/date');
const Icecream = require('../../models/icecream');
const User = require('../../models/user');
const { getUserById } = require('./common');


module.exports = {
    icecreams: async () =>{
        try{
            const icecreams = await Icecream.find();
            //return icecreams;
            return icecreams.map(icecream => {
                return {
                    ...icecream._doc,
                    _id: icecream.id,
                    date: dateToString(icecream.date),
                    orderby: getUserById.bind(this, icecream._doc.orderby)
                };
            });
        }catch(err){
            console.log(err);
        };
    },
    
    createIcecream: async (args, req) => {
        //check authentication token
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        try{
            const icecream = new Icecream({
                flavor1: args.icecreamInput.flavor1,
                flavor2: args.icecreamInput.flavor2,
                flavor3: args.icecreamInput.flavor3,
                size: args.icecreamInput.size,
                toppings: args.icecreamInput.toppings,
                date: new Date(args.icecreamInput.date),
                orderby: req.userId
            });
            const savedIcecream = await icecream.save();

            const user = await User.findById(req.userId);
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
};