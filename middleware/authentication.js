const userModel=require('../models/User.js');
const jwt=require('jsonwebtoken');
const {UnauthenticatedError}=require('../errors');

const auth=async (req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token=authHeader.split(' ')[1];
    try{
        const payload=await jwt.verify(token,process.env.JWT_SECRET);
        req.user={userID:payload.userID,name:payload.name};
        next();
    }catch(err){
        throw new UnauthenticatedError('Authentication invalid');
    }
    
}

module.exports=auth;