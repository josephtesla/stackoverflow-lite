const User = require('../models/User');
const Question = require('../models/Question');
const getTimeStamp = require('../models/helper');

//functions to handle routes
    exports.getAllQuestions = (req, res) => {
    Question.find().sort({date_secs: -1}).then(questions => {
      res.status(200).json(questions)
    }).catch(error => {
      res.status(500).json({message:"error occured while trying to retrieve questions"})
      console.log(error.message)
    })
  }
  exports.getPageQuestions = (req, res) => {
    var perPage = req.params.ppage;
    var page = req.params.page;
    Question.find({})
    .skip((perPage * page) - perPage)
    .limit(parseInt(perPage))
    .sort({date_secs: -1})
    .exec().then(questions => {
      Question.countDocuments().exec((err, count) => {
        if (err) res.send(err)
        res.status(200).json({
          questions:questions,
          current:page,
          pages: Math.ceil(count/perPage)
        })
      })
    }).catch(error => {
      res.status(500).json({message:"error occured while trying to retrieve questions"})
      console.log(error.message)
    })
  }

  exports.postQuestion = (req, res) => {
    User.findById(req.body.user_id, {password:0},(err, user) => {
      if(err) {console.log(err)}
      else{
        const newQuestion = {
          user:user,
          title:req.body.title,
          description:req.body.description,
          tags:req.body.tags,
          date_posted:new Date().toDateString(),
          date_secs:new Date().getTime()
        };
        Question.create(newQuestion).then(question => {
          res.status(200).json(question);
        }).catch(error => {
          res.status(500).json({message:"something went wrong from the server"})
        })
      }
    })
  }

  exports.deleteQuestion = (req, res) => {
    const question_id = req.params.id;
    Question.deleteOne({_id:question_id}).then(deleted => {
      res.status(200).json({status:"ok", message:"successfully deleted"});
    }).catch(error => {
      console.log(error.message)
        res.status(500).json({message:"error occured while trying to delete"})
    })
  }

  exports.getSingleQuestion = (req, res) => {
    //get single question along with poster details
    const question_id = req.params.id;
    Question.findById(question_id).then(question => {
      res.status(200).json(question);
    }).catch(error  =>  {
      res.status(500).json({message:"error occured while trying to retrieve question"})
      console.log(error.message)
    })
  }

  exports.searchQuestions = (req, res) => {
            //search for questions using a keyword.
    const searchQuery = req.query.s;
    Question.find({$text: {$search:searchQuery}})
    .then(resp => {
      if (resp.length){
        res.status(200).json(resp);
      }
      else{
        res.json({message:"No matched result for search"})
      }
    })
  }