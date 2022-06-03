var express = require("express");
var url = require("url");
var bodyParser = require("body-parser");
var randomstring = require("randomstring");
var cons = require("consolidate");
var querystring = require("querystring");
var jose = require("jsrsasign");
var __ = require("underscore");
__.string = require("underscore.string");

var app = express();

app.use(bodyParser.json());

// authorization server information
var authServer = {
  baseUrl: "http://localhost:9003",
  authorizationEndpoint: "http://localhost:9003/authorize",
  approveEndpoint: "http://localhost:9003/approve",
  tokenEndpoint: "http://localhost:9003/token",
};

// client information
var clients = [
  {
    clientId: "3104EWFB72CC-C30B-4C35-E082-3FD68C65WEWE40DE",
    userGroups: [
      {
        userGroupId: "CRGE32-HIOKE33-4223ERG",
        users: [
          {
            userId: "1",
            username: "jskarpetis",
            password: "koko1234",
            userType: "customer",
            scope: "products",
          },
          {
            userId: "2",
            username: "admin",
            password: "admin",
            userType: "admin",
            scope: "products editing",
          },
        ],
      },
    ],
  },
];

// d is the private key -- never store this key in the production code
var rsaKey = {
  alg: "RS256",
  d: "ZXFizvaQ0RzWRbMExStaS_-yVnjtSQ9YslYQF1kkuIoTwFuiEQ2OywBfuyXhTvVQxIiJqPNnUyZR6kXAhyj__wS_Px1EH8zv7BHVt1N5TjJGlubt1dhAFCZQmgz0D-PfmATdf6KLL4HIijGrE8iYOPYIPF_FL8ddaxx5rsziRRnkRMX_fIHxuSQVCe401hSS3QBZOgwVdWEb1JuODT7KUk7xPpMTw5RYCeUoCYTRQ_KO8_NQMURi3GLvbgQGQgk7fmDcug3MwutmWbpe58GoSCkmExUS0U-KEkHtFiC8L6fN2jXh1whPeRCa9eoIK8nsIY05gnLKxXTn5-aPQzSy6Q",
  e: "AQAB",
  n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
  kty: "RSA",
  kid: "authserver",
};

// These are serving as our in memory database

var accessTokens = [];

var codes = {};

var requests = {};

var logins = {};

// Searching our in memory database to find the given client
var getClient = function (clientId) {
  // Trying to find the clientId in the clients list
  return __.find(clients, function (client) {
    return client.clientId == clientId;
  });
};

var getUserGroupId = (client, userGroupId) => {
  return __.find(client.userGroups, function (group) {
    return group.userGroupId === userGroupId;
  });
};

var findRefreshToken = (requestToken) => {
  return __.find(accessTokens, (token) => {
    return token.refreshToken === requestToken;
  });
};

app.get("/", function (req, res) {});

app.post("/login", function (req, res) {
  clientId = req.headers["application-id"];
  var client = getClient(clientId);

  if (!client) {
    res.status(404).json({
      status: 404,
      statusText: "Not Found",
      error: {
        errno: req.errno,
        message: "Unknown client",
      },
    });
    return;
  } else {
    var userGroupId = req.body.userGroupId;
    var requestUserGroup = getUserGroupId(client, userGroupId);

    if (!requestUserGroup) {
      res.status(404).json({
        status: 404,
        statusText: "Not Found",
        error: {
          errno: req.errno,
          message: "Unknown User Group",
        },
      });
      return;
    } else {
      var username = req.body.userName;
      var password = req.body.passWord;

      var user = __.find(requestUserGroup.users, (user) => {
        return user.username === username && user.password === password;
      });

      if (!user) {
        res.status(401).json({
          status: 401,
          statusText: "Unauthorized",
          error: {
            errno: req.errno,
            message: "User credentials are incorrect",
          },
        });
        return;
      } else {
        var scope = user.scope;
        var loginId = randomstring.generate(12);
        logins[loginId] = req.body;

        var url = buildUrl(authServer.authorizationEndpoint, {
          loginId,
          approve: true,
          responseType: "code",
          scope,
        });
        // console.log("\n");
        // console.log("Requests -> ", requests);
        // console.log("Codes -> ", codes);
        // console.log("Logins -> ", logins);
        // console.log("Access Tokens -> ", accessTokens);
        res.redirect(url);
        return;
      }
    }
  }
});

app.post("/refresh_authorize", (req, res) => {
  clientId = req.headers["application-id"];
  var client = getClient(clientId);

  if (!client) {
    res.status(404).json({
      status: 404,
      statusText: "Not Found",
      error: {
        errno: req.errno,
        message: "Unknown client",
      },
    });
    return;
  } else {
    var requestRefreshToken = req.body.refreshToken;

    if (!requestRefreshToken) {
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        error: {
          errno: req.errno,
          message: "Unsupported Request",
        },
      });
      return;
    } else {
      var savedAccessToken = findRefreshToken(requestRefreshToken);
      if (!savedAccessToken) {
        res.status(405).json({
          status: 405,
          statusText: "Method Not Allowed",
          error: {
            errno: req.errno,
            message: "Refresh token doesn't exist",
          },
        });
        return;
      } else {
        var grandType = "refresh_token";
        var parsedUrl = buildUrl(authServer.tokenEndpoint, {
          grandType: grandType,
          refreshToken: requestRefreshToken,
        });
        res.redirect(parsedUrl);
      }
    }
  }
});

// Authorization endpoint
app.get("/authorize", function (req, res) {
  // Checking if the login id exists to avoid someone hitting the endpoint on its own
  var loginId = req.query.loginId;
  var loginRequest = logins[loginId];
  delete logins[loginId];

  if (!loginRequest) {
    res.status(405).json({
      status: 405,
      statusText: "Method Not Allowed",
      error: {
        errno: req.errno,
        message: "Method Not Allowed",
      },
    });
    return;
  } else {
    var reqid = randomstring.generate(12); // This is the request id
    requests[reqid] = {
      approve: req.query.approve,
      responseType: "code",
      scope: req.query.scope,
    };
    var redirect_url = buildUrl(authServer.approveEndpoint, { reqid: reqid });
    // console.log("\n");
    // console.log("Requests -> ", requests);
    // console.log("Codes -> ", codes);
    // console.log("Logins -> ", logins);
    // console.log("Redirect_Url -> ", redirect_url);
    // console.log("Access Tokens -> ", accessTokens);
    res.redirect(redirect_url);
    return;
  }
});

// Approve endpoint
app.get("/approve", function (req, res) {
  // Pulling the request id from the req.body
  var reqid = req.query.reqid;
  // Pulling the query from the in memory database for tha specific request id
  var query = requests[reqid];
  // Then we delete the request id, which we dont want after the approve
  delete requests[reqid];

  // If no matching query is found then error
  if (!query) {
    res.status(405).json({
      status: 405,
      statusText: "Method Not Allowed",
      error: {
        errno: req.errno,
        message: "Provided request id, does not exist or already used",
      },
    });
    return;
  }
  // If req.body.approve exists
  if (query.approve) {
    if (query.responseType == "code") {
      // Here is the randomly generated 8 digit authorization code we return to the client
      var code = randomstring.generate(8);
      // Storing the key: code with the request parameters as object value
      codes[code] = query;

      var grandType = "authorization_code";
      // Building the redirect uri that the client sent, with the information the client sent
      var urlParsed = buildUrl(authServer.tokenEndpoint, {
        code: code,
        grandType: grandType,
      });
      // console.log("\n");
      // console.log("Requests -> ", requests);
      // console.log("Codes -> ", codes);
      // console.log("Logins -> ", logins);
      // console.log("Access Tokens -> ", accessTokens);
      res.redirect(urlParsed); // Redirecting token endpoint
      return;
    } else {
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        error: {
          errno: req.errno,
          message: "Unsupported response type",
        },
      });
    }
  } else {
    res.status(403).json({
      status: 403,
      statusText: "ACCESS_FORBIDDEN",
      error: {
        message: "ACCESS_FORBIDDEN",
      },
    });
    return;
  }
});

// Token endpoint
app.get("/token", function (req, res) {
  // Checking the grandType now
  // If authorization_code
  if (req.query.grandType == "authorization_code") {
    var code = req.query.code;
    // If we find the code
    if (code) {
      var authorizationQuery = codes[code];
      if (!authorizationQuery) {
        res.status(405).json({
          status: 405,
          statusText: "Method Not Allowed",
          error: {
            errno: req.errno,
            message: "Provided code, does not exist or already used",
          },
        });
        return;
      }
      // Deletion to avoid the code randomly being used in the future (security)
      delete codes[code];
      // console.log("Auth query", authorizationQuery);
      // Generating our json web token (JWT)
      var header = { typ: "JWT", alg: rsaKey.alg, kid: rsaKey.kid };
      // Creating the payload
      var payload = {
        iss: "http://localhost:9003/", // Issuer
        sub: "E-shop user",
        aud: "http://localhost:9002/", // Audience
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 5 * 60,
        jti: randomstring.generate(8),
        scope: authorizationQuery.scope, // Scope
      };

      var privateKey = jose.KEYUTIL.getKey(rsaKey);
      // This time instead of verifying we are signing the access token
      var access_token = jose.jws.JWS.sign(
        header.alg,
        JSON.stringify(header),
        JSON.stringify(payload),
        privateKey
      );

      // We create the refreshToken
      var refreshToken = randomstring.generate();

      // save the access token created, to a database in production (in memory database here)
      // If the protected resource wants to validate if a token that its receiving is still valid it can ask the server to look into the accessTokens and see if it is still valid
      accessTokens.push({
        access_token: access_token,
        scope: authorizationQuery.scope,
        refreshToken: refreshToken,
      });

      // Saving said refresh token to in memory db

      var token_response = {
        access_token: access_token,
        token_type: "Bearer",
        scope: authorizationQuery.scope,
        refreshToken: refreshToken,
      };
      // console.log("\n");
      // console.log("Requests -> ", requests);
      // console.log("Codes -> ", codes);
      // console.log("Logins -> ", logins);
      // console.log("Access Tokens -> ", accessTokens);
      // Sending out the response
      res.status(200).json(token_response);
      return;
    }
  } else if (req.query.grandType === "refresh_token") {
    clientId = req.headers["application-id"];
    var client = getClient(clientId);

    if (!client) {
      res.status(404).json({
        status: 404,
        statusText: "Not Found",
        error: {
          errno: req.errno,
          message: "Unknown client",
        },
      });
      return;
    } else {
      var requestRefreshToken = req.query.refreshToken;

      if (!requestRefreshToken) {
        res.status(400).json({
          status: 400,
          statusText: "BAD_REQUEST",
          error: {
            errno: req.errno,
            message: "Unsupported Request 2",
          },
        });
        return;
      } else {
        var savedAccessToken = findRefreshToken(requestRefreshToken);
        if (!savedAccessToken) {
          res.status(405).json({
            status: 405,
            statusText: "Method Not Allowed",
            error: {
              errno: req.errno,
              message: "Refresh token doesn't exist",
            },
          });
          return;
        } else {
          var index = __.indexOf(accessTokens, savedAccessToken);
          var savedScope = savedAccessToken.scope;
          if (index > -1) {
            accessTokens.splice(index);
          }

          var header = { typ: "JWT", alg: rsaKey.alg, kid: rsaKey.kid };
          // Creating the payload
          var payload = {
            iss: "http://localhost:9003/", // Issuer
            sub: "E-shop user",
            aud: "http://localhost:9002/", // Audience
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 5 * 60,
            jti: randomstring.generate(8),
            scope: savedScope, // Scope
          };

          var privateKey = jose.KEYUTIL.getKey(rsaKey);
          // This time instead of verifying we are signing the access token
          var access_token = jose.jws.JWS.sign(
            header.alg,
            JSON.stringify(header),
            JSON.stringify(payload),
            privateKey
          );

          // We create the refreshToken
          var refreshToken = randomstring.generate();

          // save the access token created, to a database in production (in memory database here)
          // If the protected resource wants to validate if a token that its receiving is still valid it can ask the server to look into the accessTokens and see if it is still valid
          accessTokens.push({
            access_token: access_token,
            scope: savedScope,
            refreshToken: refreshToken,
          });

          // Saving said refresh token to in memory db

          var token_response = {
            access_token: access_token,
            token_type: "Bearer",
            scope: savedScope,
            refreshToken: refreshToken,
          };
          // console.log("\n");
          // console.log("Requests -> ", requests);
          // console.log("Codes -> ", codes);
          // console.log("Logins -> ", logins);
          // console.log("Access Tokens -> ", accessTokens);
          // Sending out the response
          res.status(200).json(token_response);
          return;
        }
      }
    }
  } else {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      error: {
        errno: req.errno,
        message: "Grant type invalid",
      },
    });
  }
  return;
});

// This function handles the build of the url for our above handlers
// base is the base url
// options are the object we pass in with the options
var buildUrl = function (base, options, hash) {
  var newUrl = url.parse(base, true);
  delete newUrl.search;
  if (!newUrl.query) {
    newUrl.query = {};
  }
  // For each option -> pass in the newUrl query the key and value pair
  __.each(options, function (value, key, list) {
    newUrl.query[key] = value;
  });
  // If there is a hash provided pass that into the newUrl as well
  if (hash) {
    newUrl.hash = hash;
  }

  // This is the return url
  return url.format(newUrl);
  // url.format takes an object with options and makes it a url
  // e.g now we have {protocol: 'http', hostname: '-that part of the base-', pathname: '-some path-', query: {key1: value1, key2:value2 ...}}
  // http://hostname/pathname?query ..
};

var server = app.listen(9003, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Authorization Server is listening at http://%s:%s", host, port);
});

// Security Threats

// Session hijacking: If url remains on the browser history
// Fix: Authorization codes are single use only
