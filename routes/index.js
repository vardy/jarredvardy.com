const config = require("../config");

/**
 * Handling "/"
 */
module.exports = (req, res) => {
    res.render('index.njk', {
        title: "",
        browserRefreshURL: config.BROWSER_REFRESH_URL
    });
}