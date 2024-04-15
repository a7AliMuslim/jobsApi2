const jobsModel=require('../models/Job.js');
const userModel=require('../models/User.js');
const {StatusCodes}=require('http-status-codes');
const {UnauthenticatedError, BadRequestError, NotFoundError}=require('../errors');

const getAllJobs=async (req,res)=>{
    if(!req.user.userID){
        throw new BadRequestError('user id invalid');
    }
    const jobs=await jobsModel.filter({createdBy:req.user.userID}).run();
    res.status(StatusCodes.OK).json({jobs, jobsCount:jobs.length});
}
const getJob=async (req,res)=>{
    const {user:{userID},params:{id:jobId}}=req;
    const job=await jobsModel.filter({createdBy:userID,id:jobId});
    if(job.length===0){
        throw new NotFoundError('job not found');
    }
    res.status(StatusCodes.OK).json({job:job[0]});
}
const createJob=async (req,res)=>{
    req.body.createdBy=req.user.userID;
    const newJob=await jobsModel.save(req.body);
    res.status(StatusCodes.CREATED).json(newJob);
}
const deleteJob=async (req,res)=>{
    const {user:{userID},params:{id:jobId}}=req;
    const jobs=await jobsModel.filter({createdBy:userID,id:jobId});
    if(jobs.length===0){
        throw new NotFoundError('job not found');
    }
    const job=jobs[0];
    job.delete();
    res.status(StatusCodes.OK).send();
}
const updateJob=async (req,res)=>{
    const {user:{userID},params:{id:jobId},body:{company,position}}=req;
    if(!company||!position){
        throw new BadRequestError('company or position is not provided');
    }
    const jobs=await jobsModel.filter({createdBy:userID,id:jobId});
    if(jobs.length===0){
        throw new NotFoundError('job not found');
    }
    const job=jobs[0];
    job.company=company;
    job.position=position;
    await job.save();
    res.status(StatusCodes.OK).json({job});
}


module.exports={
    getAllJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob
}