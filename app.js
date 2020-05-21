const express = require("express");
const nunjucks = require("nunjucks");
const app = express();

const marked = require("marked");

const rimraf = require("rimraf");
const fs = require("fs");
const path = require("path");

const config = require("./config");


// Post parser (syncronous)
// Transpiles posts in /posts/ from markdown to HTML.
// HTML posts are placed in /public/posts/. THIS IS A DESTRUCTIVE PROCESS for /public/posts/!!
function parsePosts() {
    let mdPostsPath = __dirname + "/posts"
    if (!fs.existsSync(mdPostsPath)){
        fs.mkdirSync(mdPostsPath);
    }

    let htmlPostsPath = __dirname + "/public/posts"
    if (fs.existsSync(htmlPostsPath)){
        rimraf.sync(htmlPostsPath);
        fs.mkdirSync(htmlPostsPath);
    } else {
        fs.mkdirSync(htmlPostsPath);
    }

    try {
        const files = fs.readdirSync(mdPostsPath);

        for(const file of files) {

            const mdFilePath = path.join(mdPostsPath, file);

            const fileNameSansExt = path.parse(file).name;
            const newFileName = fileNameSansExt + ".html";
            const desination = path.join(htmlPostsPath, newFileName);

            const mdFileContents = fs.readFileSync(mdFilePath, 'utf8');
            const htmlContent = marked(mdFileContents);
            fs.writeFileSync(desination, htmlContent);

            console.log("Transpiled post '%s'->'%s'", mdFilePath, desination);
        }
    }
    catch(ex) {
        console.error("Something went wrong during parsing of markdown posts: ", ex);
    }
}

parsePosts();

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
app.use("/update-stream", require("./routes/test_message_stream"));
app.use("/fire-event/:event_name", require("./routes/fire-event"));

app.use("/", require("./routes/index"));

app.listen(app.get("port"), () => {
    console.log(`App listening on port ${app.get("port")}...`);
    process.send && process.send({ 
        event: 'online', 
        url: `${config.HOST}:${app.get("port")}/` 
    });
});
