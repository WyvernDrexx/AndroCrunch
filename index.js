const server = require("./imports/express");


server.get("/", (req, res) => {
    res.render("index");
});