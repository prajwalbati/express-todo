const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
   'title': { type: String, required: true },
   'isCompleted': {type: Boolean, default: false},
   'created_at': { type: Date, default: Date.now },
   'updated_at': { type: Date, default: Date.now }
});
module.exports = mongoose.model('Todo', todoSchema);