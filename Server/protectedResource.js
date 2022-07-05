var express = require("express");
var bodyParser = require("body-parser");
var randomstring = require("randomstring");
var cons = require("consolidate");
var __ = require("underscore");
var cors = require("cors");
var jose = require("jsrsasign");
var base64url = require("base64url");

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for bearer tokens)
app.use(bodyParser.json());
app.use(cors());

var resource = {
  name: "E-shop",
  description: "E-shop products API",
};

// Same rsaKey as the client
var rsaKey = {
  alg: "RS256",
  e: "AQAB",
  n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
  kty: "RSA",
  kid: "authserver",
};

productData = [
  {
    id: "GJE-ERGX-ZWQF-ETHRY-WER",
    productName: "Leaf Rake",
    productCode: "GDN-0011",
    releaseDate: "March 19, 2018",
    description: "Leaf rake with 48-inch wooden handle",
    price: 19.95,
    starRating: 3.2,
    imageUrl: "assets/images/leaf_rake.png",
    category: "Garden",
    tags: ["rake", "leaf", "yard", "home"],
  },
  {
    id: "MJRTH-SVXCW-RYJMD-SESE",
    productName: "Garden Cart",
    productCode: "GDN-0023",
    releaseDate: "March 18, 2018",
    description: "15 gallon capacity rolling garden cart",
    price: 32.99,
    starRating: 4.2,
    imageUrl: "assets/images/garden_cart.png",
    category: "Garden",
  },
  {
    id: "WEF-ERBERQ-QDWV-WEFB-WEQQHM",
    productName: "Hammer",
    productCode: "TBX-0048",
    releaseDate: "May 21, 2018",
    description: "Curved claw steel hammer",
    price: 8.9,
    starRating: 4.8,
    imageUrl: "assets/images/hammer.png",
    category: "Toolbox",
    tags: ["tools", "hammer", "construction"],
  },
  {
    id: "WEFWE-MOKH-QWOU-VUIJGM-WEPOI",
    productName: "Saw",
    productCode: "TBX-0022",
    releaseDate: "May 15, 2018",
    description: "15-inch steel blade hand saw",
    price: 11.55,
    starRating: 3.7,
    imageUrl: "assets/images/saw.png",
    category: "Toolbox",
  },
  {
    id: "QWMBGK-TYIOS-ZJNGB-YOIUTM",
    productName: "Video Game Controller",
    productCode: "GMG-0042",
    releaseDate: "October 15, 2018",
    description: "Standard two-button video game controller",
    price: 35.95,
    starRating: 4.6,
    imageUrl: "assets/images/xbox-controller.png",
    category: "Gaming",
  },
  {
    id: "WEFWB-GTRMNKH-QWIURMG-WEOKF-WEFGKJN",
    productName: "Video Game Controller version 2",
    productCode: "GMGGR-00424232",
    releaseDate: "October 15, 2019",
    description: "Standard two-button video game controller",
    price: 45.95,
    starRating: 4.9,
    imageUrl: "assets/images/xbox-controller.png",
    category: "Gaming",
  },
];

// Middleware function
var getAccessToken = function (req, res, next) {
  var inToken = null;
  // Looking at the authorization header
  var auth = req.headers["authorization"];
  // Checking if the bearer token is there, since we are using a bearer token in our client
  if (auth && auth.toLowerCase().indexOf("bearer") == 0) {
    // Getting the bearer token which is after the bearer
    inToken = auth.slice("bearer ".length); // Our token
    // If the token is not in the authorization header then we check the request body.
  } else if (req.body && req.body.access_token) {
    // Retrieving the access token from the body
    inToken = req.body.access_token;
    // Worst case scenario, the token is in the url as a query parameter
  } else if (req.query && req.query.access_token) {
    inToken = req.query.access_token;
  }
  // Now that we have the token we need to verify it
  console.log("Incoming token: %s", inToken);

  // Checking the token signature
  var pubKey = jose.KEYUTIL.getKey(rsaKey);
  try {
    var signatureValid = jose.jws.JWS.verify(inToken, pubKey, ["RS256"]);
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "BAD_REQUEST",
      error: {
        errno: req.errno,
        message: "Invalid access token",
        resource_error: err,
      },
    });
    return;
  }

  // If the token signature is valid
  if (signatureValid) {
    console.log("Signature validated.");
    // Getting the token parts out of which the tokenParts[1] is the payload
    var tokenParts = inToken.split(".");
    // We decode the base^4 encoded payload and we parse the string of the object into an actual object
    var payload = JSON.parse(base64url.decode(tokenParts[1]));
    console.log("Payload", payload);
    // Now that we have the payload object we check the issuer, we want the issuer of the token to be the authorization server at http://localhost:9003
    if (payload.iss == "http://localhost:9003/") {
      console.log("issuer OK");
      // Once again we check if the payload.aud is an array and if that array contains the protected resource url
      if (
        (Array.isArray(payload.aud) &&
          _.contains(payload.aud, "http://localhost:9002/")) ||
        payload.aud == "http://localhost:9002/"
      ) {
        console.log("Audience OK");
        var now = Math.floor(Date.now() / 1000);

        // Checking if the token has expired or if it is still valid
        if (payload.iat <= now) {
          console.log("issued-at OK");
          if (payload.exp >= now) {
            console.log("expiration OK");
            console.log("Token valid!");
            // If all of these checks pass we add the payload as the access token to the request body
            req.access_token = payload;
          } else {
            res.status(400).json({
              status: 400,
              statusText: "BAD_REQUEST",
              error: {
                errno: req.errno,
                message: "Token is expired",
              },
            });
            return;
          }
        } else {
          res.status(400).json({
            status: 400,
            statusText: "BAD_REQUEST",
            error: {
              errno: req.errno,
              message: "Token is expired",
            },
          });
          return;
        }
      } else {
        res.status(400).json({
          status: 400,
          statusText: "BAD_REQUEST",
          error: {
            errno: req.errno,
            message: "Invalid audience",
          },
        });
        return;
      }
    } else {
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        error: {
          errno: req.errno,
          message: "Invalid issuer",
        },
      });
      return;
    }
  } else {
    res.status(400).json({
      status: 400,
      statusText: "BAD_REQUEST",
      error: {
        errno: req.errno,
        message: "Invalid access token",
      },
    });
    return;
  }
  next();
  return;
};

app.options("/products", cors());
app.options("/products/:id", cors());
app.options("/products/register-new-product", cors());
app.options("/products/update-product/", cors());
app.options("/products/delete-product/:id", cors());

// Middleware function
var requireAccessToken = function (req, res, next) {
  // Making sure that the access token is there, else we return a 401 response
  if (req.access_token) {
    next();
  } else {
    // Unauthorized response
    res.status(401).end();
    return;
  }
};

// Actual Endpoint -- Clients request
// Using the middleware functions -- notice that we use the cors() middleware here - for this specific route we enable Cross-origin resource sharing
// Cors -> mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
app.get(
  "/products",
  getAccessToken,
  requireAccessToken,
  cors(),
  function (req, res) {
    var products = [];
    console.log(req.access_token.scope);
    console.log(typeof(req.access_token.scope));
    if (typeof(req.access_token.scope)==='string') {
      req.access_token.scope = [req.access_token.scope];
    }
    // According to the scope we build the response object in this case gymStats
    if (__.contains(req.access_token.scope, "products")) {
      products = productData;
    }
    if (products.length > 1) {
      console.log("Sending Products: ", products);
      res.json(products);
    } else {
      res.status(500).json({
        status: 500,
        statusText: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }
);

app.get(
  "/products/:id",
  getAccessToken,
  requireAccessToken,
  cors(),
  (req, res) => {
    const product_id = req.params.id;
    product = __.find(productData, (product) => {
      // Weird i cant get find to work properly
      if (product.id.toString() === product_id.toString()) {
        return product;
      }
    });
    if (product) {
      console.log("\nSending product -> ", product);
      res.status(200).json(product);
    } else {
      res.status(404).json({
        status: 404,
        statusText: "NOT_FOUND",
        error: {
          errno: req.errno,
          message: "Cannot find requested resource.",
        },
      });
      return;
    }
  }
);

app.post(
  "/products/register-new-product",
  getAccessToken,
  requireAccessToken,
  cors(),
  (req, res) => {
    const submitted_product = req.body;
    if (!submitted_product) {
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        error: {
          errno: req.errno,
          message: "Request body is missing.",
        },
      });
      return;
    } else {
      const { productCode } = submitted_product;
      product = __.find(productData, (product) => {
        if (product.productCode === productCode) return true;
      });
      if (product) {
        res.status(409).json({
          status: 409,
          statusText: "CONFLICT",
          error: {
            errno: req.errno,
            message: "Product already exists.",
          },
        });
        return;
      } else {
        product_id = randomstring.generate(24).toUpperCase();

        const {
          productName,
          productCode,
          releaseDate,
          description,
          price,
          starRating,
          category,
          tags,
        } = submitted_product;

        product_to_register = {
          id: product_id,
          productName: productName,
          productCode: productCode,
          releaseDate: releaseDate,
          description: description,
          price: price,
          starRating: starRating,
          category: category,
          tags: tags,
        };

        console.log("\nRegistering product -> ", product_to_register);

        productData.push(product_to_register);
        res.status(201).json({
          status: 201,
          statusText: "CREATION_SUCCESS",
        });
      }
    }
  }
);

app.patch(
  "/products/update-product/",
  getAccessToken,
  requireAccessToken,
  cors(),
  (req, res) => {
    const id = req.body.id;
    const request_body = req.body;
    if (!id) {
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        error: {
          errno: req.errno,
          message: "Missing id.",
        },
      });
      return;
    }
    product = __.find(productData, (product) => {
      // Weird i cant get find to work properly
      if (product.id.toString() === id.toString()) {
        return product;
      }
    });

    product_index = __.indexOf(productData, product);
    // Handle the update
    if (product) {
      given_keys = Object.keys(request_body);
      for (key in product) {
        if (__.contains(given_keys, key)) {
          product[key] = request_body[key];
        }
      }
      productData[product_index] = product;
      res.status(201).json({
        status: 201,
        statusText: "Product updated",
        product: productData[product_index],
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: "NOT_FOUND",
        error: {
          errno: req.errno,
          message: "Cannot find requested resource.",
        },
      });
      return;
    }
  }
);

app.delete(
  "/products/delete-product/:id",
  getAccessToken,
  requireAccessToken,
  cors(),
  (req, res) => {
    const product_id = req.params.id;
    product = __.find(productData, (product) => {
      // Weird i cant get find to work properly
      if (product.id.toString() === product_id.toString()) {
        return product;
      }
    });
    if (product) {
      index = __.indexOf(productData, product);
      productData.splice(index, 1);
      console.log("Deleting product -> ", product);
      res.status(200).json({
        status: 200,
        statusText: "Product deleted",
        productData: productData,
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: "NOT_FOUND",
        error: {
          errno: req.errno,
          message: "Cannot find requested resource.",
        },
      });
      return;
    }
  }
);

// Protected resource listening to port 9002
var server = app.listen(9002, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;

  // console.log(
  //   "E-shop protected resource Server is listening at http://%s:%s",
  //   host,
  //   port
  // );
});

module.exports = app;
// Possible Vulnerabilities

// To avoid cross-site scripting attacks
// Validate all inputs and do html encode where necessary

// To avoid Token replay
// Tokens should have a short expiration dates, Using the refresh token to acquire the new token
// Using TLS with HSTS to enforce TLS on all connections (TLS: transport layer security - cryptographic protocol used for building secure connection between a client and a server)
// (HSTS: HTTP strict transport security -> informs browsers that the site should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS.)
// HSTS is a security header making sure https is used
