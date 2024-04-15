const userModel=require('../models/User.js');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,UnauthenticatedError}=require('../errors');
const {r}=require('../db/connect.js');

const register=async (req,res)=>{
    //let newUser= new userModel({...req.body});
    let newUser=await userModel.save({...req.body});
    const token=await newUser.getToken();
    res.status(StatusCodes.CREATED).json({user:{name:newUser.name},token});
}
const login=async (req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        throw new BadRequestError('provide email and password');
    }
    let user=await userModel.filter({email:email});
    if(user.length===0){
        throw new UnauthenticatedError('invalid credentials');
    }
    user=user[0];
    const isPasswordCorrect=await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('invalid password');
    }
    const token=await user.getToken();
    res.status(StatusCodes.OK).json({user:{name:user.name},token});
}

module.exports={
    register,
    login
}