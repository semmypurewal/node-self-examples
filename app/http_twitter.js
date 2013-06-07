var http = require("http"), // require the core http module
    ntwitter = require("ntwitter"),  // require ntwitter (installed via npm)
    credentials = require("./credentials.js"),
    server,
    twitter,
    tweetCount = 0,   // track the number of tweets seen
    hitCount = 0;  // track the number of server hits

// set up our twitter credentials
twitter = new ntwitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

// omg start streaming!
twitter.stream("statuses/filter", {"track":["awesome"]}, function (stream) {
    stream.on("error", function (err) {
        console.log(err);
    });

    stream.on("data", function (tweet) {
        tweetCount = tweetCount + 1;
        console.log(tweet.text);
    });
});

server = http.createServer(function (req, res) {
    // increment hit count
    hitCount = hitCount + 1;

    // write the header
    res.writeHeader({
        "Content-Type":"text/html"
    });

    // send the response
    res.write("<p>The server has been hit " + hitCount + " times</p>");
    res.end("<p>We've seen " + tweetCount + " tweets</p>");
});

// listen on port 3000
server.listen(3000);
console.log("server listening on port 3000");
