import { ResolverMap } from './../../types/graphql-utils';
import *as bcrypt from 'bcryptjs';
import {User} from './../../entity/User';
import { createConfirmEmailLink } from './../../utils/createConfirmEmailLink';
import { sendEmail } from "../../utils/sendEmail";

export const resolvers:ResolverMap = {
    Query:{
        bye:()=>"bye"
    },
    Mutation: {
        register : async (_, { email , password }:GQL.IRegisterOnMutationArguments, {redis,url}) =>{ 
            const userAlreadyExists = await User.findOne({
                where:{email},
                select:["id"]
            })


            if(userAlreadyExists){
                return [
                    {
                        path:"email",
                        message:"already taken"
                    }
                ];
            }
            const hashedpassword = await bcrypt.hash(password,10);
            const user = await User.create({
                email,
                password:hashedpassword
            })
            await user.save();
            if (process.env.NODE_ENV !== "test") {
                await sendEmail(
                  email,
                  await createConfirmEmailLink(url, user.id, redis)
                );
              }
            return true;
        }
    }
  }