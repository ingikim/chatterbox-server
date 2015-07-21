/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var storage = {results: []};

// data.results will be an array of objects, with each object having
// username, roomname, text, createdAt, updatedAt

var requestHandler = function(request, response) {
  console.log("\n\nServing request type " + request.method + " for url " + request.url);

  var method = request.method;
  console.log(request.method);
  var url = request.url;
  var statusCode = 0;
  var responseString = "Hello, World!";

  console.log("inside request Handler");
  console.log("URL: ",url);

  console.log(storage);

// See the note below about CORS headers.
  var headers = defaultCorsHeaders;



  if (method === "GET") {
    headers['Content-Type'] = "application/json";

    console.log("INSIDE GET");
    console.log(url);

    if (url.substring(0, 9) === '/classes/') {
      if (url.substring(9, url.length).split("?")[0] === "messages") {
        responseString = JSON.stringify(storage);
      } else {
        var roomName = url.substring(9, url.length).split("?")[0];
        var filteredStorage = {results: []};
        storage.results.forEach(function(data) {
          if(data.roomname === roomName) {
            filteredStorage.results.push(data);
          }
        });
        responseString = JSON.stringify(filteredStorage);
      }
      statusCode = 200;
    } else {
      statusCode = 404; // bad GET request; nonexistent file name
    }
  } else if (method === "POST") {
    headers['Content-Type'] = "text/plain";

    console.log("INSIDE POST");

    if (url === '/send') {
      request.on("data", function(data) {
        var msg = JSON.parse(data);
        msg.objectId = storage.results.length;
        msg.createdAt = new Date();
        msg.updatedAt = new Date()
        storage.results.push(msg); // maybe change back to unshift
      });
      statusCode = 201;
    } else if (url.substring(0, 9) === '/classes/') {
      var roomName = url.substring(9, url.length).split("?")[0];
      if (roomName.length) {
        request.on("data", function(data) {
          var msg = JSON.parse(data);
          msg.roomname = roomName;
          msg.objectId = storage.results.length;
          msg.createdAt = new Date();
          msg.updatedAt = new Date()
          storage.results.push(msg);
        });
        statusCode = 201;
      } else {
        statusCode = 400;
      }
    } else { // URL to POST request is not valid
      statusCode = 400;
    }
  } else if (method === "OPTIONS") {
    console.log("OPTIONS getting called");
    responseString += "Allow: GET, POST, OPTIONS";
    statusCode = 200;
    console.log(responseString);
  } else { // bad request
    statusCode = 400;
  }

  response.writeHead(statusCode, headers);
  response.end(responseString);
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;

