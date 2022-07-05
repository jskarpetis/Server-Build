jest.useFakeTimers();
const protectedResource = require("../protectedResource");
const request = require("supertest");
const randomstring = require("randomstring");
const jose = require("jsrsasign");

var rsaKey = {
  alg: "RS256",
  d: "ZXFizvaQ0RzWRbMExStaS_-yVnjtSQ9YslYQF1kkuIoTwFuiEQ2OywBfuyXhTvVQxIiJqPNnUyZR6kXAhyj__wS_Px1EH8zv7BHVt1N5TjJGlubt1dhAFCZQmgz0D-PfmATdf6KLL4HIijGrE8iYOPYIPF_FL8ddaxx5rsziRRnkRMX_fIHxuSQVCe401hSS3QBZOgwVdWEb1JuODT7KUk7xPpMTw5RYCeUoCYTRQ_KO8_NQMURi3GLvbgQGQgk7fmDcug3MwutmWbpe58GoSCkmExUS0U-KEkHtFiC8L6fN2jXh1whPeRCa9eoIK8nsIY05gnLKxXTn5-aPQzSy6Q",
  e: "AQAB",
  n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
  kty: "RSA",
  kid: "authserver",
};

const produceFakeToken = (iss, aud, iat, exp) => {
  var header = { typ: "JWT", alg: rsaKey.alg, kid: rsaKey.kid };
  // Creating the payload
  var payload = {
    iss: iss, // WRONG ISSUER
    sub: "E-shop user",
    aud: aud, // Audience
    iat: iat,
    exp: exp,
    jti: randomstring.generate(8),
    scope: ["products"], // Scope
  };

  var privateKey = jose.KEYUTIL.getKey(rsaKey);
  // This time instead of verifying we are signing the access token
  var access_token = jose.jws.JWS.sign(
    header.alg,
    JSON.stringify(header),
    JSON.stringify(payload),
    privateKey
  );
  return access_token;
};

describe("Any request to the protected resource", () => {
  it("returns status code 400 if the bearer token signature is invalid", async () => {
    const res = await request(protectedResource).get("/products");
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual("Invalid access token");
  });

  it("Return status code 400 if the issuer of the token is invalid", async () => {
    const res = await request(protectedResource)
      .get("/products")
      .send({
        access_token: produceFakeToken(
          "http://localhost:9000/",
          "http://localhost:9002/",
          Math.floor(Date.now() / 1000),
          Math.floor(Date.now() / 1000) + 5 * 60
        ),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual("Invalid issuer");
  });

  it("Returns status code 400 if the audience of the token is invalid", async () => {
    const res = await request(protectedResource)
      .get("/products")
      .send({
        access_token: produceFakeToken(
          "http://localhost:9003/",
          "http://localhost:9001/",
          Math.floor(Date.now() / 1000),
          Math.floor(Date.now() / 1000) + 5 * 60
        ),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.message).toEqual("Invalid audience");
  });
});

// Not working for some reason
// describe("GET /products/:id", () => {
//   it("Returns status code 404 if the provided id doesn't exist", async () => {
//     const res = request(protectedResource)
//       .get("/products")
//       .send({
//         access_token: produceFakeToken(
//           "http://localhost:9003/",
//           "http://localhost:9002/",
//           Math.floor(Date.now() / 1000),
//           Math.floor(Date.now() / 1000) + 5 * 60
//         ),
//       })
//       .query({ id: "random" });
//     expect(res.statusCode).toEqual(404);
//     expect(res.body.error.message).toEqual("Cannot find requested resource");
//   });
// });

// describe("GET /products/:id", () => {});
