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
    thumbnail: {
        type: String,
        default: "default.jpg"
    },
    uploader: String,
    created: {
        type: Date
    },
    downloads: {
        type: Number,
        default: 0
    },
    name: String
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
    thumbnail: {
        type: String,
        default: "default.jpg"
    },
    uploader: String,
    created: Date,
    downloads: {
        type: Number,
        default: 0
    },
    name: String

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
    uploader: String,
    thumbnail: {
        type: String,
        default: "default.jpg"
    },
    created: Date,
    downloads: {
        type: Number,
        default: 0
    },
    name: String

});
const App = mongoose.model("Application", appSchema);

const presetSchema             = new mongoose.Schema({
    filename: String,
    size: Number,
    referenceFile: String,
    mimetype: {
        type: String,
        default: "zip"
    },
    description: String,
    uploader: String,
    thumbnail: {
        type: String,
        default: "default.jpg"
    },
    created: Date,
    downloads: {
        type: Number,
        default: 0
    },
    name: String

});
const Preset = mongoose.model("Preset", presetSchema);

uploads.Image = Image;
uploads.Audio = Audio;
uploads.App   = App;
uploads.Preset = Preset;

module.exports = uploads;
