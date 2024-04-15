const thinky=require('../db/connect.js');
const type=thinky.type;
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {BadRequestError}=require('../errors');

const userSchema={
    name:type.string().required().min(3).max(50),
    email:type.string().required().regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    password:type.string().required().min(3),
    id:type.string(),
}
const userModel=thinky.createModel('User',userSchema);


userModel.pre('save', async function(next){
    if(!this.email){
        next()
        return;
    }
    const matches=await thinky.r.table('User').filter({email:this.email}).run();
    if(matches.length!==0){
        next(new BadRequestError('email already registered'));
    }else{
        next();
    }
});

userModel.pre('save', async function(next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});
userModel.define('getToken',async function(){
    const token=await jwt.sign({userID:this.id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
    return token;
});
userModel.define('comparePassword',async function(userPassword){
    const isMatch=await bcrypt.compare(userPassword,this.password);
    return isMatch;
});

module.exports=userModel;