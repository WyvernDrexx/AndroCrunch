const server = require("./imports/express");
const PORT = process.env.PORT || 3000;

server.get("/", (req, res) => {
    res.render("index");
});

//  Required routes

server.use(require("./routes/index"));

//Wildcard route//
server.get("*", (req, res) => {
    res.send("Invalid url!");
});

server.listen(PORT, process.env.IP, () => {
    console.log("Listening....");
});