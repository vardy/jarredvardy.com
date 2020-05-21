const config = require("../config");

/**
 * Handling "/posts/:post"
 */
module.exports = (req, res) => {
    res.render(`posts/${req.params["post"]}.njk`, {
        titleOverride: "",
        browserRefreshURL: config.BROWSER_REFRESH_URL
    });
}