var path = require('path');

// Routes
module.exports = function (app) {
    app.get("/save", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/saveArticle.html"));
    });

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/home.html"));
    });
}