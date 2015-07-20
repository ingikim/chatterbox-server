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
  var statusCode = 200;
  var responseString = "Hello, World!";

  console.log("inside request Handler");



// See the note below about CORS headers.
  var headers = defaultCorsHeaders;



  if (method === "GET") {
    headers['Content-Type'] = "application/json";


    console.log("INSIDE GET");
    responseString = JSON.stringify(storage);
  } else if (method === "POST") {
    headers['Content-Type'] = "text/plain";

    console.log("INSIDE POST");

    request.on("data", function(data) {
      var msg = JSON.parse(data);
      msg.objectId = storage.results.length;
      msg.createdAt = new Date();
      msg.updatedAt = new Date()
      storage.results.push(msg);
    });
    

  } else if (method === "OPTIONS") {

  } else {
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

