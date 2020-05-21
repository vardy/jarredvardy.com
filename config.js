const config = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PUBSUB_CHANNEL: process.env.REDIS_PUBSUB_CHANNEL,
    BROWSER_REFRESH_URL: process.env.BROWSER_REFRESH_URL
}

module.exports = config
