const mongoose = require("mongoose");
const subSchema = new mongoose.Schema({
    email: String
});
const Subscribe = mongoose.model("subcriber",subSchema);
module.exports = Subscribe;