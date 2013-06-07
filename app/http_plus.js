// import the core http module
var http = require("http"),
    server,
    hitCount;

// initialize hitCount to 0
hitCount = 0;

server = http.createServer(function (req, res) {
    // increment hit count
    hitCount = hitCount + 1;

    // write the header
    res.writeHeader({
        "Content-Type":"text/html"
    });

    // send the response
    res.end("<p>The server has been hit " + hitCount + " times</p>");
});

// listen on port 3000
server.listen(3000);
