const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    list: {
        downloads: {
            type: Number,
            default: 15
        },
        subscribers: {
            type: Number,
            default: 2
        },
        wallpapers: {
            type: Number,
            default: 117
        },
        ringtones: {
            type: Number,
            default: 4
        },
        presets: {
            type: Number,
            default: 4
        },
        apps: {
            type: Number,
            default: 4
        },
        trending: { //An array with objects of different types for storing most downloaded items
            apps: Array,
            ringtones: Array,
            wallpapers: Array,
            presets: Array
        }
    }
});

const Data = mongoose.model("Data", dataSchema);
module.exports = Data;