const { dateToString } = require('../../helpers/date');

const Icecream = require('../../models/icecream');
const User = require('../../models/user');


const getIcecreamByIds = async icecreamIds => {
    try{
        const getAllIc = await Icecream.find({ _id: { $in: icecreamIds } });
        //console.log(getAllIc);
        return getAllIc.map(icecream => {
            return {
                ...icecream._doc,
                _id: icecream.id,
                date: dateToString(icecream.date),
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

exports.getIcecreamByIds = getIcecreamByIds;
exports.singleIcecream = singleIcecream;
exports.getUserById = getUserById;