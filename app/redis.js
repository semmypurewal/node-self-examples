var http = require("http"), // require the core http module
    ntwitter = require("ntwitter"),  // require ntwitter (installed via npm)
    redis = require("redis"), // require redis (installed via npm)
    credentials = require("./credentials.js"),
    server,
    twitter,
    words,
    tweetCount = 0,   // track the number of tweets seen
    hitCount = 0;  // track the number of server hits

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
        tweetCount = tweetCount + 1;
        
        // check to see which word appears
        words.forEach(function (word) {
            if (tweet.text.indexOf(word) > -1) {
                // increment the appropriate redis counter
                redisClient.incr(word);
            }
        });
    });
});

server = http.createServer(function (req, res) {
    // increment hit count
    hitCount = hitCount + 1;

    // write the header
    res.writeHeader({
        "Content-Type":"text/html"
    });

    // get the counts from redis
    redisClient.mget(words, function (err, counts) {
        // this is called when the redis client returns
        if (err) {
            console.log("OMG ERROR");
        }

        // add an entry for each word to the response
        words.forEach(function (word) {
            res.write("<p>"+word+":"+counts[words.indexOf(word)]+"</p>");
        });

        // send the response
        res.write("<p>The server has been hit " + hitCount + " times</p>");
        res.end("<p>We've seen " + tweetCount + " tweets</p>");
    });
});

// listen on port 3000
server.listen(3000);
console.log("server listening on port 3000");
