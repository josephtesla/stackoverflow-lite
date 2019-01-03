const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
   description: String,
   upvotes: String,
   date_posted: Date,
   user: Object,
   question_id: String,
   upvoters: Array

})

module.exports = mongoose.model('Answer', answerSchema);