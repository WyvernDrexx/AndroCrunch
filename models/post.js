const passportLocalMongoose = require("passport-local-mongoose"), 
    mongoose                = require("mongoose");

const postSchema = new mongoose.Schema({
    author: String,
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: String,
    subtitle: String,
    rating: Number,
    comments: {
        type: mongoose.Types.ObjectId,
        ref: "Comments"
    },
    content: String,
    created: {
        type: Date,
        default: Date.now()
    }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;