import { describe } from "mocha";
import request from "supertest";
import { app } from "../src/app";

const response = request(app).post("/auth/register").send({
  username: "testuser",
  password: "testpassword",
  email: "testemail@example.com",
  phoneNumber: "55555555555",
});

console.log((response as any)._data);

describe("Creating a test post", () => {
  it("should return OK status", () =>
    request(app).post("/posts/add").send({
      title: "test title",
      body: "test body",
    }));
});
