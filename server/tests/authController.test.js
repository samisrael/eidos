// server/tests/authController.test.js
const path = require("path");
const httpMocks = require("node-mocks-http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock the user model module using a string literal path so Jest can hoist the mock.
// The path below is relative to the test file.
jest.mock("../src/models/userModel.js", () => {
  const ctor = jest.fn();
  ctor.findOne = jest.fn();
  return ctor;
});

// Now require the mocked module and then the controller that depends on it.
const User = require("../src/models/userModel.js");

// require controller after mocking model
const authController = require(path.resolve(
  __dirname,
  "..",
  "src",
  "controllers",
  "authController.js"
));

describe("Auth Controller - register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should register a new user and respond 201", async () => {
    const fakeSave = jest.fn().mockResolvedValue({});
    User.mockImplementation(() => ({ save: fakeSave }));

    const req = httpMocks.createRequest({
      method: "POST",
      body: { username: "alice", password: "pass123", role: "user" },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPass");

    await authController.register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
    expect(User).toHaveBeenCalledWith({
      username: "alice",
      password: "hashedPass",
      role: "user",
    });
    expect(fakeSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("New user registered"),
      })
    );
  });

  test("should return 500 on save error", async () => {
    const fakeSave = jest.fn().mockRejectedValue(new Error("db fail"));
    User.mockImplementation(() => ({ save: fakeSave }));

    const req = httpMocks.createRequest({
      method: "POST",
      body: { username: "bob", password: "p", role: "user" },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    jest.spyOn(bcrypt, "hash").mockResolvedValue("h");

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});

describe("Auth Controller - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should login successfully and return token", async () => {
    const fakeUser = {
      _id: "user-id-1",
      username: "alice",
      password: "storedHash",
      role: "user",
    };
    User.findOne = jest.fn().mockResolvedValue(fakeUser);

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jest.spyOn(jwt, "sign").mockReturnValue("fake-jwt-token");

    const req = httpMocks.createRequest({
      method: "POST",
      body: { username: "alice", password: "pass123" },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await authController.login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ username: "alice" });
    expect(bcrypt.compare).toHaveBeenCalledWith("pass123", "storedHash");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: fakeUser._id, role: fakeUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "fake-jwt-token" });
  });

  test("should return 404 when user not found", async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const req = httpMocks.createRequest({
      method: "POST",
      body: { username: "noone", password: "x" },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  test("should return 400 on wrong password", async () => {
    const fakeUser = {
      _id: "id",
      username: "u",
      password: "hash",
      role: "user",
    };
    User.findOne = jest.fn().mockResolvedValue(fakeUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const req = httpMocks.createRequest({
      method: "POST",
      body: { username: "u", password: "wrong" },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid Password!" })
    );
  });

  test("should return 500 on unexpected error", async () => {
    User.findOne = jest.fn().mockRejectedValue(new Error("db fail"));
    const req = httpMocks.createRequest({
      method: "POST",
      body: { username: "x", password: "y" },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});
