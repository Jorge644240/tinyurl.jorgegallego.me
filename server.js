const express = require("express");
const bodyParser = require("body-parser");
const tinyURL = require("tinyurl");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3004;

app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", {
        shortenedUrl: ""
    });
});

app.post("/", (req, res) => {
    const url = req.body.url;
    tinyURL.shorten(url)
    .then((response) => {
        const shortenedUrl = response;
        res.render("index", {
            url: url,
            shortenedUrl: shortenedUrl
        });
    }, (error) => {
        console.error(error);
        res.render("failure", {
            error: `We were unable to shorten your URL (${url})`,
            url: url
        });
    });
});

app.get("/robots.txt", (req, res) => {
    res.sendFile(path.join(__dirname, "robots.txt"));
});

app.get("/sitemap.xml", (req, res) => {
    res.sendFile(path.join(__dirname, "sitemap.xml"));
});

app.all(["*/robots", "*/robots.txt"], (req, res) => {
    res.redirect("/robots.txt");
});

app.all(["*/sitemap", "*/sitemap.xml"], (req, res) => {
    res.redirect("/sitemap.xml");
});

app.use("*/", (req, res) => {
    res.status(404).render("error", {
        error: {
            code: 404,
            message: "The page you're looking for doesn't exist"
        }
    });
});

app.use((err, req, res, next) => {
    res.status(500).render("error", {
        error: {
            code: 500,
            message: "There is a problem with the server"
        }
    });
});

app.listen(port);