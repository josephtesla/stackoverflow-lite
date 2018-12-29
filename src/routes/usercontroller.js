const User = require('../models/User');
const Question = require('../models/Question');
const express = require('express');


//functions to handle user routes

   exports.getUserprofile  = (req, res) => {
      const user_id = req.params.id;
      User.findById(user_id,{password:0}).then(user => {
         res.status(200).json(user);
      }).catch(error => {
         res.status(500).json({message:"error occured while trying to retrieve user's profile"})
            console.log(error.message);
      })
   }

   exports.getUserQuestions = (req,res) => {
      //answers come with the users' information 
      const user_id = req.params.id;
      Question.find({user_id:user_id}).then(result => {
         res.status(200).json({count:result.length, result:result});
      }).catch(error => {
         res.status(500).json({message:"error occured while trying to retrieve user's question"})
            console.log(error.message)
      })
   }

