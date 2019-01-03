const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Comment = require('../models/Comment');
const getTimeStamp = require('../models/helper');
//functions to handle routes		
	exports.getAnswersForAQuestion = (req, res) => {
    //answers come with the users' information 
    var question_id = req.params.id;
    Answer.find({question_id:question_id},{upvoters:0})
    .sort({upvotes:-1}).then(result => {
      if (result.length){
        res.status(200).json({count:result.length, result: result});
      }
      res.status(201).json({count:result.length, message:"no answer for this question"})
      }).catch(error => {
        res.status(500).json({message:"error occured while trying to retrieve Answers"})
        console.log(error.message)
      })
    }


    exports.getSingleAnswer = (req, res) => {
      //get single Answer
      const answer_id = req.params.id;
      Answer.findById(answer_id).then(answer => {
        res.status(200).json(answer);
      }).catch(error  =>  {
        res.status(500).json({message:"error occured while trying to retrieve question"})
        console.log(error.message)
      })
    }

  exports.getUsersComments = (req, res) => {
    //this function returns the comments by users for a particular Answer
    	const question_id = req.params.qid;
      const answer_id = req.params.id;
      const constraints = {
        question_id:question_id,
        answer_id:answer_id
      }
      Comment.find(constraints).sort({date_posted:-1})
      .then(result => {
        if (result.length){
          res.status(200).json({ count:result.length, result:result});
        }
        res.status(200).json({count:result.length, message:"no comment for this answer"})
      }).catch(error => {
        res.status(500).json({message:"error occured while trying to retrieve comments"})
        console.log(error.message)
      })
  }

    exports.postAnswerToAQuestion = (req, res) => {
      console.log(req.params.id)
      User.findById(req.body.user_id).then(user => {
        const newAnswer = {
          user:user,
          description:req.body.description,
          question_id:req.params.id,
          upvotes: 0,
          preferred:false,
          date_posted: getTimeStamp()
        };
        Answer.create(newAnswer).then(answer => {
          res.status(200).json({answer, message:"answer successfully posted!"})
        }).then(error => {
          console.log(error.message)
          res.send(error.message)
        })
      }).then(error => {
        console.log(error.message)
        res.send(error.message)
      })
    }

  exports.upvoteAnswer  = (req, res) => {
    const user_id = req.params.userid;
    const answer_id = req.params.id;
    Answer.findById(answer_id)
		.then(result => {
    	var currentUpvotes = parseInt(result.upvotes);
    	var newUpvotes = currentUpvotes + 1;
			Answer.updateOne({_id: answer_id},{$set:{upvotes:newUpvotes}})
			.then(() => {
          Answer.findById(answer_id).then(updatedrow => {
            updatedrow.upvoters.push(user_id);
            updatedrow.save();
            res.status(200).json({status:"updated", result:updatedrow});
          })
      }).catch(error => {
          res.status(500).json(error.message);
        })
  	})
  }
  
  
  exports.downvoteAnswer = (req, res) => {
      const user_id = req.params.id;
      const answer_id = req.params.id;
      Answer.findById(answer_id)
      .then(result => {
        var currentUpvotes = parseInt(result.upvotes);
        var newUpvotes = currentUpvotes - 1;
        Answer.updateOne({_id: answer_id},{$set:{upvotes:newUpvotes}})
        .then(() => {
            Answer.findById(answer_id).then(updatedrow => {
              updatedrow.upvoters.splice(updatedrow.upvoters.indexOf(user_id),1)
              updatedrow.save();
              res.status(200).json({status:"updated", result:updatedrow});
            })
        }).catch(error => {
            res.status(500).json(error.message);
          })
      })
  }

  exports.acceptAsPreferred = (req, res) => {
		const answer_id = req.params.id;
    const question_id = req.params.qid;
    Question.updateOne({_id:question_id},{$set : {preferred_id:answer_id}})
    .then(() => {
        Question.findById(question_id).then(updatedrow => {
          res.status(200).json({status:"updated", result:updatedrow});
        })
      })
    }

  exports.createComment = (req, res) => {
    User.findById(req.body.user_id,{password:0,date_registed:0})
    .then(user => {
      console.log(user)
      const newComment = {
        user:user,
        text:req.body.text,
        question_id:req.params.qid,
        answer_id:req.params.id,
        likes:0,
        date_posted: getTimeStamp()
      }
      Comment.create(newComment)
      .then(result => {
        res.status(200).json(result)
      }).catch(error => {
        res.status(201).json({error:"couldn't create comment"})
      })
    }).catch(error => {
      console.log(error)
    })
    
    
	}
	
