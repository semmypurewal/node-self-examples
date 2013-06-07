// import the core http module
var http = require("http"),
    server;

server = http.createServer(function (request, response) {
    // this function handles incoming http requests
    response.writeHeader({
        "Content-type":"text/html"
    });
    response.end("<p>Hello World!</p>");
});

// listen on port 3000
server.listen(3000);

