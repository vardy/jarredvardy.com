const router = require('express').Router();

const config = require("../config");
const postsUtil = require("../utils/posts");

/**
 * Handling GET "/"
 */
router.get("/", function(req, res) {
    res.render('index.njk', {
        titleOverride: "",
        latestPosts: postsUtil.getLatestPosts(5),
        browserRefreshURL: config.BROWSER_REFRESH_URL
    });
});

module.exports = router;