const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
   text: String,
   likes: String,
   date_posted: String,
   user: Object,
   question_id: String,
   answer_id: String,
   likers:Array,
   date_secs:String
})

module.exports = mongoose.model('Comment', commentSchema);