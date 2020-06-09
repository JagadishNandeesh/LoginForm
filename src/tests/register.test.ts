import { request } from "graphql-request";
import { host } from "./constants";
import { User } from "../entity/User";
import { startServer } from "../startServer";
import { AddressInfo } from 'net';

const email = "tom@bob.com";
const password = "jalksdf";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;





export let TestHost: string;





beforeAll(async () => {
  await startTestServer();
});

export async function startTestServer() {
  const app = await startServer();
  // const { port } = app.address() as AddressInfo;
  // TestHost = `http://127.0.0.1:${port}`;
}

test("Register user", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});