const router = require('express').Router();

const config = require("../config");
const postsUtil = require("../utils/posts");

/**
 * Handling "/blog
 */
router.get("/", function (req, res) {
    res.render("blog.njk", {
        titleOverride: "",
        allPosts: postsUtil.getOrderedPosts(),
        browserRefreshURL: config.BROWSER_REFRESH_URL
    });
});

/**
 * Handling "/blog/:post"
 */
router.get("/:post", function (req, res) {
    postsUtil.getPostBySlug(req.params["post"], function(post){
        res.render(`posts/${req.params["post"]}.njk`, {
            titleOverride: "",
            post: post,
            browserRefreshURL: config.BROWSER_REFRESH_URL
        });
    });
});

module.exports = router;