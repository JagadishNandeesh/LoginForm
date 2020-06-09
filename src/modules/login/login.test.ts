
import {request} from 'graphql-request';
const loginMutation =(e:string,p:string)=>`
mutation{
    login(email:"${e}",password:"${p}"){
        path
        message
    }
}
`;
describe("login",()=>{

    test("email not found error",async ()=>{
        const response =await request(
            process.env.Test_HOST as String,
            loginMutation("bob@Blob.com","whatever")
        );

        expect(response).toEqual({
            login:[{
                path:"email",
                error:"invalid login"
            }]
        })

    })

})
