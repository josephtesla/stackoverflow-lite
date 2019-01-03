const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')
const Questioncontroller = require('./routes/questioncontroller');
const Answercontroller = require('./routes/answercontroller');
const Authcontroller = require('./routes/authcontroller');
const Usercontroller = require('./routes/usercontroller');
const verifyToken = require('./middleware/verify');
//mongodb://<dbuser>:<dbpassword>@ds145053.mlab.com:45053/stackoverflow
mongoose.connect("mongodb://josephtesla:tesla98@ds145053.mlab.com:45053/stackoverflow")
.then(conn => {console.log("connected")}).catch(err => {console.log(err)})


var app = express();
app.use(express.static(path.join(__dirname, 'public')))

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//url for app frontend
var front = require('../front/front');
app.use('/',front)

//Enable Cross origin resource sharing (CORS)
app.use(cors());

//API ENDPOINTS
//purposely placed authentication routes at the top to prevent token verification
app.post('/api/v1/auth/register', Authcontroller.authRegister )
app.post('/api/v1/auth/login',  Authcontroller.authLogin )

//middleware to verify token across all routes
//app.use(verifyToken);

app.get('/api/v1/auth/me' , Authcontroller.testToken)

app.get('/api/v1/users/:id',  Usercontroller.getUserprofile);

app.get('/api/v1/users/:id/questions',  Usercontroller.getUserQuestions);

app.get('/api/v1/questions' , Questioncontroller.getAllQuestions);

app.post('/api/v1/questions',  Questioncontroller.postQuestion);

app.delete('/api/v1/questions/:id',  Questioncontroller.deleteQuestion);

app.get('/api/v1/questions/:id',  Questioncontroller.getSingleQuestion);

app.get('/api/v1/questions/:id/answers',  Answercontroller.getAnswersForAQuestion);

app.get('/api/v1/answers/:id',  Answercontroller.getSingleAnswer)

app.post('/api/v1/questions/:id/answers',  Answercontroller.postAnswerToAQuestion);

app.post('/api/v1/answers/:qid/:id/comments', Answercontroller.createComment);

app.get('/api/v1/answers/:qid/:id/comments', Answercontroller.getUsersComments)

app.put('/api/v1/answers/:id/:userid/upvote', Answercontroller.upvoteAnswer)

app.put('/api/v1/answers/:id/:userid/downvote', Answercontroller.downvoteAnswer)

app.put('/api/v1/answers/:qid/:id/accept', Answercontroller.acceptAsPreferred)

app.get('/api/v1/search/questions', Questioncontroller.searchQuestions);

//error handlers
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });



app.listen(process.env.PORT ||  8000  ,() =>{
    console.log("server started at port: " + 8000);
})
