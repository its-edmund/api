import { assert } from "chai";
import request from "supertest";

import { app } from "../src/app";

describe("Unit testing the /auth/register route", () => {
  it("should return OK status", () =>
    request(app)
      .post("/auth/register")
      .send({ username: "testuser", password: "testpassword", email: "testemail@example.com" })
      .then(response => {
        assert.equal(response.status, 200);
      }));
});

describe("Unit testing the /auth/login route", () => {
  it("should return OK status", () =>
    request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" })
      .then(response => {
        assert.equal(response.status, 200);
      }));
});
