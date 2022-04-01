import { assert } from "chai";
import request from "supertest";

import { app } from "../src/app";

describe("Registering test user", () => {
  it("should return OK status", () =>
    request(app)
      .post("/auth/register")
      .send({
        username: "testuser",
        password: "testpassword",
        email: "testemail@example.com",
        phoneNumber: "55555555555",
      })
      .then(response => {
        assert.equal(response.status, 201);
      }));
});

describe("Logging in with test user", () => {
  it("should return OK status", () =>
    request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" })
      .then(response => {
        assert.equal(response.status, 200);
      }));
});

describe("Deleting test user account", () => {
  it("should return OK status", () =>
    request(app)
      .delete("/auth/delete")
      .send({
        username: "testuser",
      })
      .then(response => {
        assert.equal(response.status, 204);
      }));
});

describe("Logging in with non-existant user", () => {
  it("should fail with a 400 error ", () =>
    request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" })
      .then(response => {
        assert.equal(response.status, 400);
      }));
});
