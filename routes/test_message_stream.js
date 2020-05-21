const redis = require("redis");
const config = require("../config");

/**
 * Handling "/update-stream"
 */
module.exports = (req, res) => {
    req.socket.setTimeout(2147483647); // Max possible socket delay
  
    let messageCount = 0;
    const subscriber = redis.createClient({host: config.REDIS_HOST});
  
    subscriber.subscribe(config.REDIS_PUBSUB_CHANNEL);
  
    subscriber.on("error", function(err) {
      console.log("Redis Error: " + err);
    });
  
    // New message on Redis pub
    subscriber.on("message", function(channel, message) {
      messageCount++;
  
      res.write('id: ' + messageCount + '\n');
      res.write("data: " + message + '\n\n');
    });
  
    //send headers for event-stream connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
  
    req.on("close", function() {
      subscriber.unsubscribe();
      subscriber.quit();
    });
  };