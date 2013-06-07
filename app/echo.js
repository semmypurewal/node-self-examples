// import the core 'net' module
var net = require("net"),
    server;

// create the server
server = net.createServer(function (socket) {
    // this function is called when
    // a client connects
    console.log("a connection was made!");

    socket.on("data", function (data) {
        // this function is called when
        // data is sent to the socket
        console.log("data was received!");
        socket.write(data);
    });
});

// this is called right after the server
// is defined
server.listen(3000);
console.log("the server is listening on port 3000");
