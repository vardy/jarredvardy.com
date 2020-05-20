const redis = require('redis');

/**
 * Handling "/update-stream"
 */
module.exports = (req, res) => {
    // let request last as long as possible
    req.socket.setTimeout(2147483647); // Max possible delay
  
    var messageCount = 0;
    var subscriber = redis.createClient({host: process.env.REDIS_HOST});
  
    subscriber.subscribe("updates");
  
    // In case we encounter an error...print it out to the console
    subscriber.on("error", function(err) {
      console.log("Redis Error: " + err);
    });
  
    // When we receive a message from the redis connection
    subscriber.on("message", function(channel, message) {
      messageCount++; // Increment our message count
  
      res.write('id: ' + messageCount + '\n');
      res.write("data: " + message + '\n\n'); // Note the extra newline
    });
  
    //send headers for event-stream connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
  
    // The 'close' event is fired when a user closes their browser window.
    // In that situation we want to make sure our redis channel subscription
    // is properly shut down to prevent memory leaks...and incorrect subscriber
    // counts to the channel.
    req.on("close", function() {
      subscriber.unsubscribe();
      subscriber.quit();
    });
  };