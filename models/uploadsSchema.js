const mongoose              =   require("mongoose");
const uploads               =   new Object();

const imageSchema           = new mongoose.Schema({
    filename: String,
    size: Number,
    referenceFile: String,
    mimetype: {
        type: String,
        default: "image"
    },
    description: String,
    thumbnail: String,
    uploader: String,
    created: {
        type: Date
    }
});
const Image = mongoose.model("Image", imageSchema);


const audioSchema           = new mongoose.Schema({
    filename: String,
    size: Number,
    referenceFile: String,
    mimetype: {
        type: String,
        default: "audio"
    },
    description: String,
    thumbnail: String
});
const Audio = mongoose.model("Audio", audioSchema);


const appSchema             = new mongoose.Schema({
    filename: String,
    size: Number,
    referenceFile: String,
    mimetype: {
        type: String,
        default: "application"
    },
    description: String,
    thumbnail: String
});
const App = mongoose.model("Application", appSchema);


uploads.Image = Image;
uploads.Audio = Audio;
uploads.App   = App;

module.exports = uploads;
