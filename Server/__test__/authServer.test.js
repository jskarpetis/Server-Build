const authServer = require("../authorizationServer");
const request = require("supertest");
jest.setTimeout(3000);
describe("POST /login", () => {
  it("returns status code 404 if client is unknown", async () => {
    const res = await request(authServer)
      .post("/login")
      .set("Accept", "application/json")
      .set("Application-id", "random")
      .send({
        userName: "admin",
        passWord: "admin",
        userGroupId: "CRGE32-HIOKE33-4223ERG",
      })
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(res.statusCode).toEqual(404);
    expect(res.body.error.message).toEqual("Unknown client");
  });

  it("returns status code 404 if user group id is unknown", async () => {
    const res = await request(authServer)
      .post("/login")
      .set("Accept", "application/json")
      .set("Application-id", "3104EWFB72CC-C30B-4C35-E082-3FD68C65WEWE40DE")
      .send({
        userName: "admin",
        passWord: "admin",
        userGroupId: "random",
      })
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(res.statusCode).toEqual(404);
    expect(res.body.error.message).toEqual("Unknown User Group");
  });

  it("returns status code 401 if input credentials are incorrect", async () => {
    const res = await request(authServer)
      .post("/login")
      .set("Accept", "application/json")
      .set("Application-id", "3104EWFB72CC-C30B-4C35-E082-3FD68C65WEWE40DE")
      .send({
        userName: "randomtest",
        passWord: "admin",
        userGroupId: "CRGE32-HIOKE33-4223ERG",
      })
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(res.statusCode).toEqual(401);
    expect(res.body.error.message).toEqual("User credentials are incorrect");
  });

  it("returns status code 302 if it redirected to the next endpoint", async () => {
    const res = await request(authServer)
      .post("/login")
      .set("Accept", "application/json")
      .set("Application-id", "3104EWFB72CC-C30B-4C35-E082-3FD68C65WEWE40DE")
      .send({
        userName: "admin",
        passWord: "admin",
        userGroupId: "CRGE32-HIOKE33-4223ERG",
      });

    expect(res.statusCode).toEqual(302);
  });
});

describe("POST /refresh_authorize", () => {
  it("returns status code 404 if client is unknown", async () => {
    const res = await request(authServer)
      .post("/refresh_authorize")
      .set("Accept", "application/json")
      .set("Application-id", "random")
      .send({
        refreshToken: "lPAUMsokLChxAYDHvpSY0rVIj17RNJr3",
      })
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(res.statusCode).toEqual(404);
    expect(res.body.error.message).toEqual("Unknown client");
  });

  it("returns status code 400 if no refresh token is provided", async () => {
    const res = await request(authServer)
      .post("/refresh_authorize")
      .set("Accept", "application/json")
      .set("Application-id", "3104EWFB72CC-C30B-4C35-E082-3FD68C65WEWE40DE")
      .send({})
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual("Unsupported Request");
  });

  it("returns status code 405 if the refresh token doesn't exist in the database", async () => {
    const res = await request(authServer)
      .post("/refresh_authorize")
      .set("Accept", "application/json")
      .set("Application-id", "3104EWFB72CC-C30B-4C35-E082-3FD68C65WEWE40DE")
      .send({ refreshToken: "lPAUMsokLChxAYDHvpSY0rVIj17RNJr3" })
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(res.statusCode).toEqual(405);
    expect(res.body.error.message).toEqual("Refresh token doesn't exist");
  });
});

describe("GET /authorize", () => {
  it("returns status code 405 if login id doesn't exists", async () => {
    const res = await request(authServer).get("/authorize");
    expect(res.statusCode).toEqual(405);
    expect(res.body.error.message).toEqual("Method Not Allowed");
  });
});

describe("GET /approve", () => {
  it("returns status code 405 if request id doesn't exist in the database", async () => {
    const res = await request(authServer).get("/approve");
    expect(res.statusCode).toEqual(405);
    expect(res.body.error.message).toEqual(
      "Provided request id, does not exist or already used"
    );
  });
});

describe("GET /token", () => {
  it("returns status code 400 if the request query grandType is not authorization_code or refresh_token", async () => {
    const res = await request(authServer)
      .get("/token")
      .query("?grandType=random");
    expect(res.body.error.message).toEqual("Grant type invalid");
    expect(res.statusCode).toEqual(400);
  });

  it("returns status code 405 if the request query code doesn't exist in the database with authorization_code as grandType", async () => {
    const res = await request(authServer).get("/token").query({
      grandType: "authorization_code",
      code: 1202322,
    });

    expect(res.body.error.message).toEqual(
      "Provided code, does not exist or already used"
    );
    expect(res.statusCode).toEqual(405);
  });

  it("returns status code 404 if grandType is refresh_token and the client is unknown", async () => {
    const res = await request(authServer)
      .get("/token")
      .query({
        grandType: "refresh_token",
      })
      .set("Application_id", "random");

    expect(res.body.error.message).toEqual("Unknown client");
    expect(res.statusCode).toEqual(404);
  });

  it("returns status code 400 if grandType is refresh_token and refresh_token has not been provided", async () => {
    const res = await request(authServer)
      .get("/token")
      .query({
        grandType: "refresh_token",
      })
      .set("Application-id", "3104EWFB72CC-C30B-4C35-E082-3FD68C65WEWE40DE");

    expect(res.body.error.message).toEqual("Unsupported Request 2");
    expect(res.statusCode).toEqual(400);
  });
});
