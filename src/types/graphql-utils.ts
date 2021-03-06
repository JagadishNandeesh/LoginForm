import { Redis } from "ioredis";
import {Request} from "express";

export interface Session{
    userId?:string
}

export type Resolver =(
    parent:any,
    args:any,
    context:{
        redis:Redis,
        url:string,
        session:Session,
        req:Request
    },
    info:any
)=>any;

export type GraphQLMiddlewareFunc=(
    resolver : Resolver,
    parent:any,
    args:any,
    context:{
        redis:Redis;
        url:String;
        session:Session;
        req:Request
    },
    info:any
)=>any;

export interface ResolverMap{
    [key:string]:{
        [key:string]:Resolver
    }
}


