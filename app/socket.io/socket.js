var http = require("http"), // require the core http module
    events = require("events"),
    fs = require("fs"),
    emitter = new events.EventEmitter(),
    ntwitter = require("ntwitter"),  // require ntwitter (installed via npm)
    redis = require("redis"), // require redis (installed via npm)
    io = require("socket.io"),
    credentials = require("../credentials.js"),
    server,
    twitter,
    words;

// create our redis connection
redisClient = redis.createClient();

// set up our twitter credentials
twitter = new ntwitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

// set up track array
words = ["awesome", "cool", "rad", "gnarly", "groovy"];

// omg start streaming!
twitter.stream("statuses/filter", {"track":words}, function (stream) {
    stream.on("error", function (err) {
        console.log(err);
    });

    stream.on("data", function (tweet) {
        // check to see which word appears
        words.forEach(function (word) {
            if (tweet.text.indexOf(word) > -1) {
                // increment the appropriate redis counter
                redisClient.incr(word, function (err, count) {
                    if (err === null) {
                        emitter.emit("update", {"word":word, "count":count});
                    }
                });
            }
        });
    });
});


server = http.createServer(function (req, res) {
    var rs = fs.createReadStream("index.html");
    rs.pipe(res);
});

// listen on port 3000
server.listen(3000);
console.log("server listening on port 3000");

io.listen(server).sockets.on("connection", function (socket) {
    // get the current counts
    redisClient.mget(words, function (err, counts) {
        socket.emit("words", {"words":words, "counts":counts});
    });

    emitter.on("update", function (data) {
        socket.emit("update", data);
    });
});
