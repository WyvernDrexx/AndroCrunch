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
    comments: {
        type: mongoose.Types.ObjectId,
        ref: "Comments"
    },
    content: String,
    created: {
        type: Date,
        default: Date.now()
    },
    tags: String,
    published: {
        type: Boolean,
        default: true
    }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;