const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
   title: String,
   description: String,
   tags: String,
   user: Object,
   date_posted:String,
   preferred_id:String

})

module.exports = mongoose.model('Question', questionSchema);

                                                                                                                                                                  
