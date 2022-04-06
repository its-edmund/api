import { assert } from "chai";
import request from "supertest";

import { app } from "../src/app";

let userId = "";

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

const rand = generateRandomNumber().toString();

describe("Unit testing the /auth/register route", () => {
  it("should return OK status", () =>
    request(app)
      .post("/auth/register")
      .send({
        username: `testuser${rand}`,
        password: `testpassword${rand}`,
        email: `testemail${rand}@example.com`,
        phoneNumber: "9136170133",
      })
      .then(response => {
        userId = response.body._id;
        assert.equal(response.status, 201);
      }));
});

describe("Unit testing the /auth/login route", () => {
  it("should return OK status", () =>
    request(app)
      .post("/auth/login")
      .send({ username: `testuser${rand}`, password: `testpassword${rand}` })
      .then(response => {
        assert.equal(response.status, 200);
      }));
});

console.log(userId);

describe("Unit testing deleting user", () => {
  it("should return OK status", () =>
    request(app)
      .delete(`/auth/${userId}`)
      .then(response => assert.equal(response.status, 204)));
});
