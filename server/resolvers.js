import {Job,Company} from './db.js';

export const resolvers = {
    Query:{
       job: async (root,{id})=>{
        return await Job.findById(id);
       },
       jobs :  async()=>{
       return await Job.findAll();
       },
       company: async(root,{id})=>{
        return await Company.findById(id);
       }
    },
    Mutation:{
        createJob: async(_root,{input}, context)=> {
            console.log(context);
            if(!context){
                throw new Error("authorization token is missing/invalid");
            }
            
            return await Job.create({...input,companyId : context.user.companyId})
            
        },
        deleteJob: async(_root,{id},{user})=> {
            if(user && user.comapnyId === id)
            return await Job.delete(id);
            throw new Error('authorization token is missing/invalid')
        },
        updateJob: async(_root,{input},{user})=> {
            if(user)
            return await Job.update({...input,companyId : user.companyId});
            throw new Error('authorization token is missing/invalid')
        },
    },
    Job:{
        company: async(job)=>{
            const companyid = job.companyId
            return await Company.findById(companyid)
        }
    },
    Company:{
        jobs: async(Company)=>{
            const res = await Job.findAll( (job)=>job.companyId === Company.id);
            console.log(res);
            return res;
        }
    }
};