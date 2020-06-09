import "reflect-metadata";
import "dotenv/config";
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
//import {resolvers} from './resolvers';
import * as path from 'path';
import { createTypeormConn } from "./utils/createTypeormConn";
import * as fs from 'fs';
import {mergeSchemas,makeExecutableSchema} from 'graphql-tools';
import {GraphQLSchema} from 'graphql';
import {redis} from './redis';
import { User } from "./entity/User";
import * as session from "express-session";
import * as connectRedis from 'connect-redis';
import {redisSessionIdPrefix} from "./constants";




const  RedisStore =connectRedis(session);

export const startServer=async ()=>{
  //  const typeDefs = importSchema(path.join(__dirname,"./schema.graphql"));
  //  const server = new GraphQLServer({ typeDefs, resolvers })
    const schemas: GraphQLSchema[]=[];
    const folders = fs.readdirSync(path.join(__dirname,'./modules'));
    folders.forEach(module=>{
        const {resolvers} = require(`./modules/${module}/resolvers`);
        const typeDefs = importSchema(
            path.join(__dirname,`./modules/${module}/schema.graphql`)
        );
        schemas.push(makeExecutableSchema({resolvers,typeDefs}))
    });
  
  
    const schema: any = mergeSchemas({ schemas });
    const server = new GraphQLServer({ 
        schema,
        context:({request})=>({
            redis,
            url:request.protocol+"://"+request.get("host"),
            session:request.session,
            req:request
        })
     });

    const SESSION_SECRET="collsecret"
    server.express.use(session({
        store:new RedisStore({
            client:redis as any,
            prefix: redisSessionIdPrefix
        }),
        name:"qid",
        secret:SESSION_SECRET,
        resave:false,
        saveUninitialized: false,
        cookie:{
            httpOnly:true,
            secure:process.env.NODE_ENV=="production",
            maxAge:1000*60*60*24*7
        }
    })
    );
    const cors={
        credentials:true,
        origin:"http://localhost:3000"
    }


    server.express.get("/confirm/:id",async(req,res)=>{
        const {id}= req.params;
        const  userid =await redis.get(id);
        if(userid){ 
            await User.update({id:userid} ,{confirmed:true});
            res.send('ok');
        }else{
            res.send('invalid');
        }
      
    })
    await createTypeormConn();
    await server.start({cors,port : process.env.NODE_ENV==="test"?0:4000});
    console.log('Server is running on localhost:4000')
}

