import * as bcrypt from "bcryptjs";
import {ResolverMap} from "../../types/graphql-utils";
import {User} from "../../entity/User";
import {userSessionIdPrefix} from "../../constants";

const errorResponse=[
    {
        path:"email",
        message :"Invalid login"
    }
]

export const resolvers:ResolverMap={
    Query:{
        dummy2:()=>"bye"
    },
    Mutation:{
        login:async(_,{email,password}:GQL.ILoginOnMutationArguments,{session,redis,req})=>{
            const user= await User.findOne({where:{email}});
            if(!user){
                return errorResponse;
            }

            if(!user.confirmed){
                return [
                    {
                        path:"email",
                        message:"Email not confirmed"
                    }
                ]
            }
        
        const valid =await bcrypt.compare(password,user.password);

        if(!valid){
            return errorResponse;
        }

        session.userId=user.id;
        if(req.sessionID){
            await redis.lpush(`${userSessionIdPrefix}${user.id}`,req.sessionID)
        }
        return null;
    }
}
}