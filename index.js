const server = require("./imports/express");
const PORT = process.env.PORT || 3000;

server.get("/", (req, res) => {
    res.render("index");
});

server.listen(PORT, process.env.IP, () => {
    console.log("Listening....");
});