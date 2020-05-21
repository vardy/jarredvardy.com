const config = {
    HOST: process.env.HOST || "http://localhost",
    PORT: process.env.PORT || "3000",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PUBSUB_CHANNEL: process.env.REDIS_PUBSUB_CHANNEL || "updates",
    BROWSER_REFRESH_URL: process.env.BROWSER_REFRESH_URL
}

module.exports = config
