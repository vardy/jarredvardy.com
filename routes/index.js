/**
 * Handling "/"
 */
module.exports = (req, res) => {
    res.render("index", {name: "Some test name"});
};