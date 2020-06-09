import {getConnectionOptions, createConnection} from 'typeorm';


export const createTypeormConn =async ()=>{
    console.log(process.env.NODE_ENV);
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return createConnection ({...connectionOptions,name:"default"});
}