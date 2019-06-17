const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    author: String,
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: String,
    rating: Number,
    image: {
        type: String,
        default: "default.jpg"
    },
    assets: [

    ],
    content: String,
    created: {
        type: Date,
        default: Date.now()
    },
    tags:String,
    published: {
        type: Boolean,
        default: false
    },
    draft: {
        type: Boolean,
        default: true
    }
});

const postDraft = mongoose.model("postdraft", postSchema);
module.exports = postDraft;