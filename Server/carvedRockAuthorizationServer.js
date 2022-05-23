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
app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for the token endpoint)

// authorization server information
var authServer = {
  authorizationEndpoint: "http://localhost:9003/authorize",
  tokenEndpoint: "http://localhost:9003/token",
};

// client information
var clients = [
  {
    client_id: "e-shop-customer",
    client_secret: "e-shop-secret-customer", // Never store it in here
    scope: "products",
  },
  {
    client_id: "e-shop-admin",
    client_secret: "e-shop-secret-admin", // Never store it in here
    scope: "products editing",
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
var refreshTokens = {};

var accessTokens = [];

var codes = {};

var requests = {};

// Searching our in memory database to find the given client
var getClient = function (clientId) {
  // Trying to find the clientId in the clients list
  return __.find(clients, function (client) {
    return client.client_id == clientId;
  });
};

app.get("/", function (req, res) {
  res.render("index", { clients: clients, authServer: authServer });
});

// Authorization endpoint
app.get("/authorize", function (req, res) {
  var client = getClient(req.query.client_id); // Trying to find if the client exists in our client list

  // If there is no such client with provided id then error
  if (!client) {
    res.status(400).json({
      status: 400,
      statusText: "BAD_REQUEST",
      error: {
        errno: req.errno,
        message: "Unknown client",
      },
    });
    return;
  } else {
    // If there is a request.query.scope then take it and split it with " "
    // The split() method returns the new array.
    var request_scope = req.query.scope
      ? req.query.scope.split(" ")
      : undefined;
    var client_scope = client.scope ? client.scope.split(" ") : undefined;
    // Checking if the two scopes are different -- we want them to be exactly the same
    if (__.difference(request_scope, client_scope).length > 0) {
      // If they are different then redirect to an invalid scope url
      // This is probably another form of returning an error
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        error: {
          errno: req.errno,
          message: "Request Scope - Registered Scope differ",
        },
      });
      return;
    }

    // this could be the user session as well
    var reqid = randomstring.generate(8); // This is the request id
    requests[reqid] = req.query; // Passing in the requests object -> key: reqid - value: req.query (representing the request)

    // Approved authorization
    res.status(200).json({
      reqid: reqid,
      request_query: req.query,
    });
    return;
  }
});

// Approve endpoint
app.post("/approve", function (req, res) {
  // Pulling the request id from the req.body
  var reqid = req.body.reqid;
  // Pulling the query from the in memory database for tha specific request id
  var query = requests[reqid];
  // Then we delete the request id, which we dont want after the approve
  delete requests[reqid];

  // If no matching query is found then error
  if (!query) {
    res.status(400).json({
      status: 400,
      statusText: "BAD_REQUEST",
      message: "Provided request id, does not exist or already used",
      request_body: req.body,
    });
    return;
  }
  // If req.body.approve exists
  if (req.body.approve) {
    if (query.response_type == "code") {
      // Pulling the request scope
      var request_scope = getScopesFromForm(req.body);
      // Pulling the client
      var client = getClient(query.client_id);
      // If there is a client scope then split it
      var client_scope = client.scope ? client.scope.split(" ") : undefined;
      // If the client and request scope are not exactly the same -> redirect to error page
      if (__.difference(request_scope, client_scope).length > 0) {
        var urlParsed = buildUrl(query.redirect_uri, {
          error: "invalid_scope",
        });
        res.status(400).json({
          status: 400,
          statusText: "BAD_REQUEST",
          redirectURI: urlParsed,
          error: {
            message: "Invalid scope provided",
          },
        });
        // res.redirect(urlParsed);
        return;
      }

      // Here is the randomly generated 8 digit authorization code we return to the client
      var code = randomstring.generate(8);
      // Storing the key: code with the request parameters as object value
      codes[code] = { request: query, scope: request_scope };

      // Building the redirect uri that the client sent, with the information the client sent
      var urlParsed = buildUrl(query.redirect_uri, {
        code: code,
        state: query.state,
      });
      res.status(200).json({
        code: code,
        state: query.state,
        urlParsed: urlParsed,
      });
      // res.redirect(urlParsed); // Redirecting to the requested uri
      return;
    } else {
      // If the response type is not code then -> redirect to an unsupported response type url
      var urlParsed = buildUrl(query.redirect_uri, {
        error: "unsupported_response_type",
      });
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        urlParse: urlParsed,
        error: {
          message: "Unsupported_response_type",
        },
      });
      // res.redirect(urlParsed);
    }
  } else {
    // If there is not req.body.approve then access is not permitted, instant error
    var urlParsed = buildUrl(query.redirect_uri, {
      error: "access_denied",
    });

    res.status(400).json({
      status: 400,
      statusText: "BAD_REQUEST",
      urlParsed: urlParsed,
      error: {
        message: "Access denied",
      },
    });
    return;
  }
});

// Token endpoint
// Here the clients are gonna give us the authorization code again and ask for a token
app.post("/token", function (req, res) {
  // First we check the authorization header
  var auth = req.headers["authorization"];
  // If there is one
  if (auth) {
    // check the auth header
    // The client credentials are encoded with querystring.escape, so we decode them
    var clientCredentials = decodeClientCredentials(auth); // Retrieving the client credential according to the authorization code given
    var clientId = clientCredentials.id; // Pulling the client id
    var clientSecret = clientCredentials.secret; // Pulling the client secret
  }

  // otherwise, check the post body
  if (req.body.client_id) {
    // Checking the response body
    // If the clientId is already set by the above piece of code from the auth header then we send an error
    if (clientId) {
      // if we've already seen the client's credentials in the authorization header, this is an error
      console.log("Client attempted to authenticate with multiple methods");
      res.status(401).json({ error: "invalid_client" });
      return;
    }
    // If the above passes then we have not seen the client id in the auth header decoded credentials and we get it here
    var clientId = req.body.client_id;
    var clientSecret = req.body.client_secret;
  }

  // We try to find the client in our client list
  var client = getClient(clientId);
  // If we dont find the client then we have another error
  if (!client) {
    console.log("Unknown client %s", clientId);
    res.status(401).json({ error: "invalid_client" });
    return;
  }

  // If we find the client but the saved client secret differs from what was given then again error
  if (client.client_secret != clientSecret) {
    console.log(
      "Mismatched client secret, expected %s got %s",
      client.client_secret,
      clientSecret
    );
    res.status(401).json({ error: "invalid_client" });
    return;
  }

  // Now that the above have passed means that we have a valid client pulled from the auth or req body - and our client matches some saved client in the in memory database
  // Checking the grant_type now
  // If authorization_code
  if (req.body.grant_type == "authorization_code") {
    // Finding the code in the in memory codes[req.body.code]
    var code = codes[req.body.code];
    console.log(code.request);
    // If we find the code
    if (code) {
      // Deletion to avoid the code randomly being used in the future (security)
      delete codes[req.body.code]; // burn our code, it's been used
      // Making sure that the client id from the original query matches the client id pulled
      if (code.request.client_id == clientId) {
        // Generating our json web token (JWT)
        var header = { typ: "JWT", alg: rsaKey.alg, kid: rsaKey.kid };
        // Creating the payload
        var payload = {
          iss: "http://localhost:9003/", // Issuer
          sub: "Carved Rock Member",
          aud: "http://localhost:9002/", // Audience
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 5 * 60,
          jti: randomstring.generate(8),
          scope: code.scope, // Scope
        };

        var privateKey = jose.KEYUTIL.getKey(rsaKey);
        // This time instead of verifying we are signing the access token
        var access_token = jose.jws.JWS.sign(
          header.alg,
          JSON.stringify(header),
          JSON.stringify(payload),
          privateKey
        );

        // save the access token created, to a database in production (in memory database here)
        // If the protected resource wants to validate if a token that its receiving is still valid it can ask the server to look into the accessTokens and see if it is still valid
        accessTokens.push({
          access_token: access_token,
          client_id: clientId,
          scope: code.scope,
        });

        // We create the refreshToken
        var refreshToken = randomstring.generate();

        // Saving said refresh token to in memory db
        refreshTokens[refreshToken] = { clientId: clientId };

        console.log("Issuing access token %s", access_token);

        // Building the response that has the token
        var token_response = {
          access_token: access_token,
          token_type: "Bearer",
          scope: code.scope.join(" "),
          refresh_token: refreshToken,
        };

        // Sending out the response
        res.status(200).json(token_response);
        console.log("Issued tokens for code %s", req.body.code);
        return;
      } else {
        // If code.request.clientId !== clientId
        console.log(
          "Client mismatch, expected %s got %s",
          code.request.client_id,
          clientId
        );
        res.status(400).json({ error: "invalid_grant" });
        return;
      }
    } else {
      // If there is no such code in our db
      console.log("Unknown code, %s", req.body.code);
      res.status(400).json({ error: "invalid_grant" });
      return;
    }
  } else if (req.body.grant_type == "refresh_token") {
    // Finding token in in memory db
    var token = refreshTokens[req.body.refresh_token];

    if (token) {
      console.log(
        "We found a matching refresh token: %s",
        req.body.refresh_token
      );
      // If the client id given is not the same as the client id from the saved token then probably security breach, delete the token
      if (token.client_id != clientId) {
        // token may have been compromised, remove it
        delete refreshTokens[token];
        res.status(400).json({ error: "invalid_grant" });
        return;
      }
      // In other case, construct the payload
      var header = { typ: "JWT", alg: rsaKey.alg, kid: rsaKey.kid };
      var payload = {
        iss: "http://localhost:9003/",
        sub: "Carved Rock Member",
        aud: "http://localhost:9002/",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 5 * 60,
        jti: randomstring.generate(8),
        scope: code.scope,
      };

      var refreshToken = randomstring.generate();

      var privateKey = jose.KEYUTIL.getKey(rsaKey);
      var access_token = jose.jws.JWS.sign(
        header.alg,
        JSON.stringify(header),
        JSON.stringify(payload),
        privateKey
      );

      // save this to a database in production
      accessTokens.push({
        access_token: access_token,
        client_id: clientId,
        scope: code.scope,
      });

      // We dont need the bearer type now, we are only interested in the refresh token
      var token_response = {
        access_token: access_token,
        client_id: clientId,
        scope: code.scope,
        refresh_token: refreshToken,
      };

      res.status(200).json(token_response);
      return;
    } else {
      console.log("No matching token was found.");
      res.status(400).json({ error: "invalid_grant" });
      return;
    }
  } else {
    console.log("Unknown grant type %s", req.body.grant_type);
    res.status(400).json({ error: "unsupported_grant_type" });
  }
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

var decodeClientCredentials = function (auth) {
  var clientCredentials = Buffer.from(auth.slice("basic ".length), "base64")
    .toString()
    .split(":");
  // querystring.unescape decodes the escaped credential
  var clientId = querystring.unescape(clientCredentials[0]);
  // querystring.unescape decodes the escaped credential
  var clientSecret = querystring.unescape(clientCredentials[1]);
  return { id: clientId, secret: clientSecret }; // Returning the id and secret
};

var getScopesFromForm = function (body) {
  console.log(body);
  return __.filter(__.keys(body), function (s) {
    return __.string.startsWith(s, "scope_");
  }).map(function (s) {
    return s.slice("scope_".length);
  });
};

app.use("/", express.static("files/authorizationServer"));

var server = app.listen(9003, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(
    "Carved Rock Authorization Server is listening at http://%s:%s",
    host,
    port
  );
});

// Security Threats

// Session hijacking: If url remains on the browser history
// Fix: Authorization codes are single use only

// Redirect Uri manipulation (Allowing subdirectory or allowing subdomain validation opens security holes )
// Fix: Make sure to use exact matching validation for redirect uris

// Client Impersonation: Attacker steals authorization code -> uses it with his redirect uri -> Authorization server doesn't verify redirect Uri and gives token to the attacker
// Fix: When a redirect uri is in the initial request, the auth server must validate the redirect uri sent in the access token request
