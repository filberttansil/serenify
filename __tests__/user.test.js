const request = require("supertest");
const app = require("../app");
// panggil model user
const { User } = require("../models");
// panggil generate token jwt
const { generateToken } = require("../helpers/jwt");

describe("login", () => {
  let customer;
  beforeAll(async () => {
    customer = await User.create({
      username: "username",
      email: "logintest@gmail.com",
      password: "123456",
      role: "mentor",
      birthDate: "2000-08-21 14:20:27.816 +0700",
      gender: "male",
    });
  });

  afterAll(async () => {
    customer = await User.destroy({
      where: {
        email: "logintest@gmail.com",
      },
    });
  });

  it("response with json", async () => {
    try {
      const response = await request(app)
        .post("/users/login")
        .set("Accept", "application/json")
        .send({ email: "logintest@gmail.com", password: "123456" });

      const token = generateToken({
        id: customer.id,
        email: customer.email,
        role: customer.role,
      });

      expect(response.status).toEqual(200);
      const responseBody = response.body;
      expect(responseBody).toHaveProperty("access_token", token);
    } catch (error) {
      console.log(error);
    }
  });

  it("when password invalid", async () => {
    const response = await request(app)
      //endpoiint
      .post("/users/login")
      //header
      .set("Accept", "application/json")
      //body
      .send({ email: "logintest@gmail.com", password: "123458" });

    console.log(response.status, "<< this status");

    expect(response.status).toEqual(401);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("message", "Invalid email or password");
  });

  it("when email invalid", async () => {
    const response = await request(app)
      //endpoiint
      .post("/users/login")
      //header
      .set("Accept", "application/json")
      //body
      .send({ email: "logintest@ail.com", password: "123456" });

    console.log(response);

    expect(response.status).toEqual(401);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("message", "Invalid email or password");
  });
});

describe("register", () => {
  let customer;

  afterAll(async () => {
    customer = await User.destroy({
      where: {
        email: "test1@gmail.com",
      },
    });
  });

  it("register success", async () => {
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send({
        username: "username1",
        email: "test1@gmail.com",
        password: "123456",
        role: "mentor",
        birthDate: "2000-08-21 14:20:27.816 +0700",
        gender: "male",
      });

    // console.log(response.status, "<<<");

    expect(response.status).toEqual(201);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("email", "test1@gmail.com");
  });

  it("when username is empty", async () => {
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send({
        username: "",
        email: "test1@gmail.com",
        password: "123456",
        role: "mentor",
        birthDate: "2000-08-21 14:20:27.816 +0700",
        gender: "male",
      });

    console.log(response.status, "<<<");

    expect(response.status).toEqual(400);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("message", ["Username is required"]);
  });
  it("when email is empty", async () => {
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send({
        username: "username1",
        email: "",
        password: "123456",
        role: "mentor",
        birthDate: "2000-08-21 14:20:27.816 +0700",
        gender: "male",
      });

    console.log(response.status, "<<<");

    expect(response.status).toEqual(400);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("message", ["Email is required"]);
  });

  it("when password is empty", async () => {
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send({
        username: "username1",
        email: "test1@gmail.com",
        password: "",
        role: "mentor",
        birthDate: "2000-08-21 14:20:27.816 +0700",
        gender: "male",
      });

    console.log(response.status, "<<<");

    expect(response.status).toEqual(400);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("message", ["Password is required"]);
  });
  it("when birthDate is empty", async () => {
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send({
        username: "username1",
        email: "test1@gmail.com",
        password: "123456",
        role: "mentor",
        birthDate: "",
        gender: "male",
      });

    console.log(response.status, "<<<");

    expect(response.status).toEqual(400);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("message", ["Birth Date is required"]);
  });
  it("when gender is empty", async () => {
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send({
        username: "username1",
        email: "test1@gmail.com",
        password: "123456",
        role: "mentor",
        birthDate: "2000-08-21 14:20:27.816 +0700",
        gender: "",
      });

    console.log(response.status, "<<<");

    expect(response.status).toEqual(400);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("message", ["Gender is required"]);
  });

  it;
});

describe("edit user", () => {
  let customer;
  beforeAll(async () => {
    customer = await User.create({
      username: "username",
      email: "logintest@gmail.com",
      password: "123456",
      role: "mentor",
      birthDate: "2000-08-21 14:20:27.816 +0700",
      gender: "male",
    });
  });

  afterAll(async () => {
    customer = await User.destroy({
      where: {
        email: "logintest@gmail.com",
      },
    });
  });

  it("response with json", async () => {
    try {
      const response = await request(app)
        .put("/users")
        .set("Accept", "application/json")
        .send({ email: "logintest@gmail.com", password: "123456" });

      const token = generateToken({
        id: customer.id,
        email: customer.email,
        role: customer.role,
      });

      expect(response.status).toEqual(201);
      const responseBody = response.body;
      expect(responseBody).toHaveProperty(
        "message",
        "User with id 1 has been updated"
      );
    } catch (error) {
      console.log(error);
    }
  });
});

describe("delete user", () => {
  let customer;
  beforeAll(async () => {
    customer = await User.create({
      username: "username",
      email: "logintest@gmail.com",
      password: "123456",
      role: "mentor",
      birthDate: "2000-08-21 14:20:27.816 +0700",
      gender: "male",
    });
  });

  afterAll(async () => {
    customer = await User.destroy({
      where: {
        email: "logintest@gmail.com",
      },
    });
  });

  it("response with json", async () => {
    try {
      const response = await request(app)
        .post("/users/login")
        .set("Accept", "application/json")
        .send({ email: "logintest@gmail.com", password: "123456" });

      const token = generateToken({
        id: customer.id,
        email: customer.email,
        role: customer.role,
      });

      expect(response.status).toEqual(201);
      const responseBody = response.body;
      expect(responseBody).toHaveProperty(
        "message",
        "Your account has been deleted"
      );
    } catch (error) {
      console.log(error);
    }
  });
});