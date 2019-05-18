const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    author: String,
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: String,
    rating: Number,
    image: String,
    comments: {
        type: mongoose.Types.ObjectId,
        ref: "Comments"
    },
    content: String,
    created: {
        type: Date,
        default: Date.now()
    },
    tags:String
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;