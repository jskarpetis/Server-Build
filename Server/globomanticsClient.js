// Logic
// We want to retrieve some information from some protected resource in this case the carvedRockProtectedResource
// In order to do this we need to be authorized from the server
// This component here handles the communication between the server - the client - the protected resource
// We call the servers authorization -> we retrieve the authorization key and then -> we use that key as a bearer token to be identified and be able to use the protected resource

var express = require("express");
var bodyParser = require("body-parser");
var request = require("sync-request");
var url = require("url");
var qs = require("qs");
var querystring = require("querystring");
var cons = require("consolidate");
var randomstring = require("randomstring");
var jose = require("jsrsasign");
var base64url = require("base64url");
var __ = require("underscore");
__.string = require("underscore.string");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", cons.underscore);
app.set("view engine", "html");
app.set("views", "files/client");

// authorization server information
var authServer = {
    authorizationEndpoint: "http://localhost:9003/authorize",
    tokenEndpoint: "http://localhost:9003/token",
};

var rsaKey = {
    alg: "RS256",
    e: "AQAB",
    n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
    kty: "RSA",
    kid: "authserver",
};

// client information
// Static registration
var client = {
    client_id: "globomantics-client-1",
    client_secret: "globomantics-client-secret-1",
    redirect_uris: ["http://localhost:9000/callback"], // Redirecting back to this from auth server
    scope: "visits membershipTime averageWorkoutLength", // Accessible scopes
};

var carvedRockGymApi = "http://localhost:9002/gymStats"; // This is the protected resource

var state = null;
var access_token = null;
var refresh_token = null;
var scope = null;

app.get("/", function (req, res) {});

// When we click get auth token button we go to this
app.get("/authorize", function (req, res) {
    // Refreshing the variables
    access_token = null;
    refresh_token = null;
    scope = null;
    // Creating the state
    state = randomstring.generate();

    // Building the url with the said parameters
    var authorizeUrl = buildUrl(authServer.authorizationEndpoint, {
        response_type: "code",
        scope: client.scope,
        client_id: client.client_id,
        redirect_uri: client.redirect_uris[0],
        state: state, // State parameter prevents cross site request forgery
    });

    // res.status(200).json({
    //     response_type: "code",
    //     scope: client.scope,
    //     client_id: client.client_id,
    //     redirect_uri: client.redirect_uris[0],
    //     state: state, // State parameter prevents cross site request forgery
    //     authorizeUrl: authorizeUrl,
    // });

    // Executing the redirect after we authorize the url -> security
    res.redirect(authorizeUrl);
});

// Calling the call back from the authorization server
app.get("/callback", function (req, res) {
    // Checking if there is an error in the query
    if (req.query.error) {
        // it's an error response, act accordingly
        return;
    }
    // State -> cross site request forgery
    // Pulling the state from the query - state is used for security reasons - we pull the state and we need to send it back
    var resState = req.query.state;
    // Checking if the above created state is equal to the state that we pulled from the query
    if (resState == state) {
        console.log("State value matches: expected %s got %s", state, resState);
    } else {
        // If it is not the same then we are at risk, return
        console.log("State DOES NOT MATCH: expected %s got %s", state, resState);
        res.render("error", { error: "State value did not match" });
        return;
    }

    // Getting the authorization code from the query params
    var code = req.query.code;

    var form_data = qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: client.redirect_uris[0],
    });

    // qs.stringify() : produces -> form_data = grant_type='authorization_code'&code=code&redirect_uri=client.redirect_uris[0]

    // Using http basic auth
    var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        // Authorization is encrypted -> base64
        Authorization:
            "Basic " +
            Buffer.from(querystring.escape(client.client_id) + ":" + querystring.escape(client.client_secret)).toString("base64"),
        // The Buffer.from() method creates a new buffer filled with the specified string, array, or buffer.
        // The querystring.escape() function is used to produce a percent-encoded query string from a normal string.
    };

    // This is a back channel request (user doesn't see it, browser doesn't see it)
    // Requesting to post to the authorization server endpoint
    var tokRes = request("POST", authServer.tokenEndpoint, {
        body: form_data,
        headers: headers,
    });

    console.log("Requesting access token for code %s", code);
    // Handling token response
    if (tokRes.statusCode >= 200 && tokRes.statusCode < 300) {
        var body = JSON.parse(tokRes.getBody()); // The body of the response

        // Grabbing the access token from the response body
        access_token = body.access_token;
        console.log("Got access token: %s", access_token);

        // If there is a refresh token included in the response
        if (body.refresh_token) {
            // Grabbing the refresh token
            refresh_token = body.refresh_token;
            console.log("Got refresh token: %s", refresh_token);
        }

        // If there is an access token then do some checking
        if (body.access_token) {
            console.log("Got access token: %s", body.access_token);

            // check the access token
            var pubKey = jose.KEYUTIL.getKey(rsaKey); // Using the rsa key here
            var signatureValid = jose.jws.JWS.verify(body.access_token, pubKey, ["RS256"]);

            // If the key is valid
            if (signatureValid) {
                console.log("Signature validated.");
                var tokenParts = body.access_token.split(".");
                var payload = JSON.parse(base64url.decode(tokenParts[1]));
                console.log("Payload", payload);
                // Checking who the issuer is - we want to see that it comes from the authorization server (http://localhost:9003)
                if (payload.iss == "http://localhost:9003/") {
                    console.log("issuer OK");

                    // Checking who the audience is ultimately the protected resource
                    if (
                        (Array.isArray(payload.aud) && _.contains(payload.aud, "http://localhost:9002/")) ||
                        payload.aud == "http://localhost:9002/"
                        // Array.isArray(payload.aud) checking if payload.aud is an array
                        // _.contains(payload.aud, "http://localhost:9002/") checking if the audience array contains the second parameter (url)
                    ) {
                        console.log("Audience OK");
                        var now = Math.floor(Date.now() / 1000);

                        // Making sure that the token was issued at a time earlier than now
                        if (payload.iat <= now) {
                            console.log("issued-at OK");
                            // Expiration later than now
                            if (payload.exp >= now) {
                                console.log("expiration OK");
                                // Here we know that the token is valid
                                console.log("Token valid!");
                            } else {
                                res.render("error", { error: "Token expired" });
                                // refreshAccessToken();
                            }
                        } else {
                            res.render("error", { error: "Token cannot be issued for time later than current time" });
                        }
                    } else {
                        res.render("error", { error: "Invalid audience" });
                    }
                }
            }
        }

        scope = body.scope; // Getting the response scope here
        console.log("Got scope: %s", scope);

        // Rendering the resulting access token - refresh token - scope
        res.render("index", {
            access_token: access_token,
            refresh_token: refresh_token,
            scope: scope,
        });
    } else {
        // Else render error -- This error is something we have not anticipated.
        res.render("error", {
            error: "Unable to fetch access token, server response: " + tokRes.statusCode,
        });
    }
});

// Function that refreshes the access token - same logic as the above function
var refreshAccessToken = function (req, res) {
    // Constructing the form data again
    var form_data = qs.stringify({
        grant_type: "refresh_token", // Different grant type now
        refresh_token: refresh_token,
        client_id: client.client_id,
        client_secret: client.client_secret,
        redirect_uri: client.redirect_uri,
    });
    var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    console.log("Refreshing token %s", refresh_token);
    // Executing the request to the server
    var tokRes = request("POST", authServer.tokenEndpoint, {
        body: form_data,
        headers: headers,
    });
    if (tokRes.statusCode >= 200 && tokRes.statusCode < 300) {
        var body = JSON.parse(tokRes.getBody()); // Once again the response body

        access_token = body.access_token;
        console.log("Got access token: %s", access_token);
        if (body.refresh_token) {
            refresh_token = body.refresh_token;
            console.log("Got refresh token: %s", refresh_token);
        }
        scope = body.scope;
        console.log("Got scope: %s", scope);

        // try again -- Probably because this function is intended to be used in the /gymStats
        res.redirect("/gymStats");
        return;
    } else {
        // If we call refresh token and we land here then we need a new token all together -> redirecting to /authorize to call the above
        console.log("No refresh token, asking the user to get a new access token");
        // tell the user to get a new access token
        res.redirect("/authorize");
        return;
    }
};

// Trying to get gym stats using the access token
app.get("/gymStats", function (req, res) {
    if (!access_token) {
        if (refresh_token) {
            // try to refresh and start again
            refreshAccessToken(req, res);
            return;
        } else {
            res.render("error", { error: "Missing access token." });
            return;
        }
    }
    console.log("Making request with access token %s", access_token);

    // Now that we have the access token we can make requests to the protected resource
    var headers = {
        Authorization: "Bearer " + access_token, // Now we have the token and we give it.
        "Content-Type": "application/x-www-form-urlencoded",
    };

    // Getting data from the api -> protected resource
    var resource = request("GET", carvedRockGymApi, { headers: headers });

    if (resource.statusCode >= 200 && resource.statusCode < 300) {
        // Parsing the response data
        var body = JSON.parse(resource.getBody());
        res.render("gymStats", { scope: scope, data: body });
        return;
    } else {
        // If there is an error -> refresh token and try again
        access_token = null;
        if (refresh_token) {
            // try to refresh and start again
            refreshAccessToken(req, res);
            return;
        } else {
            // If there is not refresh token then return the error and stop
            res.render("error", {
                error: "Server returned response code: " + resource.statusCode,
            });
            return;
        }
    }
});

app.use("/", express.static("files/client"));

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

// Listening on port 9000
var server = app.listen(9000, "localhost", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("OAuth Client is listening at http://%s:%s", host, port);
});
