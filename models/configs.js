var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ConfigsSchema = Schema({}, { strict: false });

module.exports = mongoose.model("configs", ConfigsSchema ,"configs");
