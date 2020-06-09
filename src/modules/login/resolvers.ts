import { ResolverMap } from './../../types/graphql-utils';
import *as bcrypt from 'bcryptjs';
import {User} from './../../entity/User';
import { userSessionIdPrefix } from '../../constants';


export const resolvers:ResolverMap = {
    Query:{
        bye2:()=>"bye"
    },
    Mutation: {
        login : async (_,{ email , password }:GQL.ILoginOnMutationArguments,{session,redis,req}) =>{ 
              
                const user  =await User.findOne({where:{email}});

                if(!user){
                    return[{
                        path:"email",
                        message:"Invalid Login"
                    }]                    
                }
                if(!user.confirmed){
                    return [
                        {
                            path:email,
                            message:"Please confirm email"
                        }
                    ]
                }

                if(!user.forgotPasswordLocked){
                    return [
                        {
                            path:"email",
                            message:"account locked"
                        }
                    ]
                }


            const valid = await bcrypt.compare(password,user.password);

            if(!valid){
                return[{
                    path:"email",
                    message:"Invalid Login"
                }]  
            }
           
            session.userId=user.id;
            if(req.sessionID){
                await redis.lpush(`${userSessionIdPrefix}${user.id}`,req.sessionID)
            }
            return [{
                path:"email",
                message:"sucess"
            }] ;
            
        }
    }
  }