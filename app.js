const express = require("express");
const nunjucks = require("nunjucks");
const app = express();

const config = require("./config");
const postUtil = require("./utils/posts")


postUtil.initPosts();

// HTML templating
nunjucks.configure(['./views'], {
    autoescape: true,
    express: app
});

// Middleware
app.set("port", config.PORT || 3000);
app.set("view engine", "nunjucks");

// Static routes for assets
app.use("/assets", express.static("./public"));

// Dynamic (logical) routes
app.use("/", require("./routes/index"));
app.use("/blog", require("./routes/blog"));
app.use("/update-stream", require("./routes/test_message_stream"));
app.use("/fire-event", require("./routes/fire-event"));

// 404
app.use(function(req, res, next) {
    let err = new Error("Page not found");
    err.status = 404;
    next(err);
});

// Error handling & 500
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.njk', {
        status: err.status || 500,
    });
});

app.listen(app.get("port"), () => {
    console.log(`App listening on port ${app.get("port")}...`);
    process.send && process.send({ 
        event: 'online', 
        url: `${config.HOST}:${app.get("port")}/` 
    });
});
