const redis = require('redis');

const publisherClient = redis.createClient({host: process.env.REDIS_HOST});

/**
 * Handling "/fire-event/:event_name"
 */
module.exports = (req, res) => {
    publisherClient.publish( 'updates', ('"' + req.params.event_name + '" page visited') );
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('All clients have received "' + req.params.event_name + '"');
    res.end();
};