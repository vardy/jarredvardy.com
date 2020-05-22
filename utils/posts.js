const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const marked = require("marked");
const highlighter = require("highlight.js");


/*  Post Metadata Schema

{
    "fileName": "example1",
    "title": "Some tutorial post",
    "date": "2020-05-23",
    "description": "This post attempts to teach X Y Z",
    "tags": ["tutorial", "javascript"],
    "icon": "https://cdn.example.com/abc123.png",
    "preamble": "Italicised text at top, under title"
}

*/

const postFileMetadataDelim = "%%% END METADATA %%%";
let blogPosts = [];

marked.setOptions({
    highlight: function(code, language) {
        const validatedLanguage = highlighter.getLanguage(language) ? language : 'plaintext';
        return highlighter.highlight(validatedLanguage, code).value;
    }
});

// Post parser (syncronous)
// Transpiles posts in /posts/ from markdown to HTML.
// HTML posts are placed in /public/posts/. THIS IS A DESTRUCTIVE PROCESS for /public/posts/!!
module.exports.initPosts = function parsePosts() {
    let mdPostsPath = __dirname + "/../posts"
    if (!fs.existsSync(mdPostsPath)){
        fs.mkdirSync(mdPostsPath);
    }

    let htmlPostsPath = __dirname + "/../views/posts"
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
            const mdFileContents = fs.readFileSync(mdFilePath, 'utf8');
            const mdFileParts = mdFileContents.split(postFileMetadataDelim);

            let htmlContent = "";
            let desination = "";
            if(mdFileParts.length == 1) {
                htmlContent = marked(mdFileContents);
                const fileNameSansExt = path.parse(file).name;
                desination = path.join(htmlPostsPath, fileNameSansExt + ".njk")
            } else {
                htmlContent = marked(mdFileParts[1]);
                const metaObj = JSON.parse(mdFileParts[0]);
                blogPosts.push(metaObj);
                desination = path.join(htmlPostsPath, metaObj.slug + ".njk")
            }
            htmlContent = 
                "{% extends \"types/post.njk\" %}\n" + 
                "{% block postContent %}" + 
                htmlContent + 
                "\n{% endblock %}";
            fs.writeFileSync(desination, htmlContent);

            console.log("Transpiled post '%s'->'%s'", mdFilePath, desination);
        }
    }
    catch(ex) {
        console.error("Something went wrong during parsing of markdown posts: ", ex);
    }
}

module.exports.getLatestPosts = function getLatestPosts(quantity) {
    return this.getOrderedPosts().reverse().slice(-quantity).reverse();
}

module.exports.getOrderedPosts = function getOrderedPosts() {
    let posts = blogPosts.slice();
    let sorter = (a, b) => {
        if(a.date != b.date) {
            return new Date(a.date) - new Date(b.date);
        } else {
            return a.title < b.title ? 1 : -1;
        }
    }
    posts.sort(sorter).reverse();
    return posts;
}

module.exports.getPostBySlug = function getPostBySlug(postSlug, callback) {
    blogPosts.forEach(post => {
        if(post.slug === postSlug) {
            console.log(post);
            callback(post);
        }
    });
}

module.exports.posts = blogPosts;
