const User = require('../models/User');
const Question = require('../models/Question');
const getTimeStamp = require('../models/helper');

//functions to handle routes
    exports.getAllQuestions = (req, res) => {
    Question.find().sort({date_posted: -1}).then(questions => {
      res.status(200).json(questions)
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
          date_posted:getTimeStamp()
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
    const Questions = new Model('questions');
    const sql = `SELECT * FROM ${Questions.table} WHERE title LIKE 
                '%${searchQuery}%' ORDER BY date_created DESC`;
    Questions.executeQuery(sql).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json({message:"error occured while trying to retrieve question"})
      console.log(error.message)
    })
  }

