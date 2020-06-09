import {v4} from 'uuid';
import {Redis} from 'ioredis';

export const createConfirmEmailLink=async (url:string, userid:string, redis:Redis)=>{
    const id=v4();
    await redis.set(id ,userid, 'ex',60*60*24);
    return `${url}/confirm/${id}`;

};

