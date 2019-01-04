const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
   description: String,
   upvotes: String,
   user: Object,
   question_id: String,
   upvoters: Array,
   date_posted: String,
   date_secs:String
})

module.exports = mongoose.model('Answer', answerSchema);