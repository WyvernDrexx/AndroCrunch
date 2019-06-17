const deleteFromSystem = require("./deleteFromSystem");

var cleanAllFiles = function (filename) {
    deleteFromSystem("thumbnail", filename);
    deleteFromSystem("thumbnail", "md-" + (filename).split("-")[1]);
    deleteFromSystem("thumbnail", "lg-" + (filename).split("-")[1]);
}

module.exports = cleanAllFiles;