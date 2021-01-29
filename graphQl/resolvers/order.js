const { dateToString } = require('../../helpers/date');
const Order = require('../../models/order');
const Icecream = require('../../models/icecream');
const { getUserById } = require('./common');
const { singleIcecream } = require('./common');

module.exports = {
    orders: async (args, req) => {
        //check authentication token
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        try{
           const orders = await Order.find();
           return orders.map(order => {
               return {
                   ...order._doc,
                   user: getUserById.bind(this, order._doc.user),
                   icecream: singleIcecream.bind(this, order._doc.icecream), 
                   createdAt: dateToString(order.createdAt),
                   updatedAt: dateToString(order.updatedAt),
               };
           }); 
        }catch(err){
            throw err;
        }
    },
    orderIcecream: async (args, req) => {
        //check authentication token
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        try{
            const getIcecream = await Icecream.findOne({_id: args.icecreamId}); 
            const order = new Order({
              user: req.userId,
              icecream: getIcecream 
           });
           const result = await order.save();
           return {
                ...result._doc,
                user: getUserById.bind(this, result._doc.user),
                icecream: singleIcecream.bind(this, result._doc.icecream), 
                createdAt: dateToString(result._doc.createdAt),
                updatedAt: dateToString(result._doc.updatedAt),
           } ;
        }catch(err){
            throw err;
        }
    },
    cancelOrder: async (args, req) => {
        //check authentication token
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
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
    }
};