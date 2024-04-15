const thinky=require('../db/connect.js');
const type=thinky.type;
const userModel=require('./User.js');
const {BadRequestError}=require('../errors');

const jobsSchema={
    company:type.string().required().max(50),
    position:type.string().required().max(100),
    status:type.string().validator((status)=>{
        const allowed=['interview','declined','pending'];
        if(!allowed.includes(status)){
            throw new BadRequestError('this status is not allowed');
            return false;
        }
        return true;
    }).default('pending'),
    createdAt: type.date().default(thinky.r.now()),
    id:type.string(),
    createdBy:type.string(),
};

const jobsModel=thinky.createModel('Jobs',jobsSchema);

///userModel.hasMany(jobsModel,'jobs','company','position','status','createdAt');
jobsModel.belongsTo(userModel,'user','createdBy','id');



module.exports=jobsModel;