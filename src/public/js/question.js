const $quesContent = document.querySelector('#content');
const $answers = document.querySelector('#answers');
const $submitAnsBtn = document.querySelector('#submitAnsBtn');
const $successplace = document.querySelector('#successplace');

const fetchSingleQuestion = (id) => {
   return fetch(`${API}/questions/${id}`)
   .then(resp => resp.json());
}

const fetchAnswersForQuestion = (id) => {
   return fetch(`${API}/questions/${id}/answers`)
   .then(resp => resp.json())
}
var html = ``;
const loadAnswers = (id) => {
   fetchAnswersForQuestion(id).then(answers => {
      $answers.innerHTML = `<header>
      <h3 class="h5">Answers to question<span class="no-of-comments">(${answers.count})</span></h3>
      </header>`;
      if (answers.result){
      answers.result.forEach(answers => {
         $answers.innerHTML += `
         <br><div  class="comment">
         <div class="comment-header d-flex justify-content-between">
           <div class="user d-flex align-items-center">
             <div class="image"><div  alt="..." class="img-fluid rounded-circle">
             <i class="fa fa-check-square-o fa-lg">
             </i><span id="upvotes-lg${answers._id}">${answers.upvotes}</span></div></div>
             <div class="title"><strong>${answers.user.name}</strong>
             <h6 class="h6">(@${answers.user.username})</h6>
             <span class="date">${answers.date_posted}</span></div>
           </div>
         </div>
         <div  class="comment-body">
           <p>${answers.description}</p>
           <div  class="comments meta-last">
            <button onclick="toggleForm('${answers._id}')" class="btn btn-info btn-sm">add comment</button>
            <div  id="list${answers._id}"></div>
            </div>
               <form action="#">
               <div id="${answers._id}" onclick="authBeforeProceed()" class="form-group mt-4 comm"><label for="quickReplyFormComment" class="">Your comment</label>
               <div id="error${answers._id}" class="alert alert-danger comment-error"></div>
               <textarea required class="form-control" id="text${answers._id}" rows="5"></textarea>
               <div class="text-center">
               <button class="btn btn-info btn-sm waves-effect waves-light" onclick="postNewComment('${answers._id}')">Post</button>
                  </div>
               </div>
               <form>
               <div id="comment${answers._id}" class="comm-ents"></div>
            </div>
         
       </div>`;
       displayUpvoters(answers._id,answers.upvotes)
       loadComments(`${answers._id}`)
      })
      document.querySelector('#counter').innerHTML = answers.count;
   }
})
   
}

const fetchComments = (ans_id) => {
   var ques_id = getQuestionId();
   return fetch(`${API}/answers/${ques_id}/${ans_id}/comments`)
   .then(response => response.json())
}

const loadComments = (id) => {
   fetchComments(id).then(results => {
      if (results.message){
         document.getElementById(`comment${id}`).innerHTML += `no comment for this question`;
      }
      if (results.result){
         document.getElementById(`comment${id}`).innerHTML += `<span class="h6">Comments(${results.count})</span>`;
         results.result.forEach((result) => {
            document.getElementById(`comment${id}`).innerHTML += `
            <div class="container">
               <div class="comment">
               <div class="post-footer d-flex "><a href="#" class="author d-flex align-items-center flex-wrap">
               <div class="title"><strong>${result.user.name} (@${result.user.username})</strong></div></a>
             <div class="d-flex align-items-center flex-wrap">       
               <div class="date"><i class="icon-clock"></i> ${result.date_posted}</div>
             </div>
           </div>
               <div  class="comment-body">
               <p class="h6">${result.text}</p>
               
            </div>`
         })
         
      }
   })
}

const loadQuestionWithAnswers = () => {
   id = getQuestionId()
   fetchSingleQuestion(id).then(result => {
         var postTags = splitTags(result.tags)
         $('title').html(`${result.title} - StackOverflow-lite`)
         $quesContent.innerHTML = `
         <div class="post-details">
           <div class="post-meta d-flex justify-content-between">
             
           </div>
          <h3>${result.title}<a ><i class="fa fa-bookmark-o"></i></a></h3>
           <div class="post-footer ">
           <a href="/${result.user.username}" class="author d-flex align-items-center flex-wrap">
               <div class="avatar"><img src="img/user.svg" alt="..." class="img-fluid"></div>
               <div class="title"><strong>${result.user.name} (@${result.user.username})</strong></div></a>
             <div class="d-flex align-items-center flex-wrap">       
               <div class="date"><i class="icon-clock"></i> ${result.date_posted}</div>
               <div class="comments meta-last"><i class="fa fa-comments"></i><span id="counter"></span></div>
             </div>
           </div>
           <div class="post-body">
            ${result.description}
           </div>
           <div class="post-tags">
           ${displayTags(result.tags)}
           </div>
         </div>`;
         loadAnswers(id);
   })
}


$('#useranswer').click(function(){
   authBeforeProceed()
})
$submitAnsBtn.addEventListener('click', function(e){
   e.preventDefault();
   if (!localStorage.getItem('userid')){
      redirect("login.html");
   }
   else{
      var $answer = document.getElementById('useranswer').value;
      var $user_id = localStorage.getItem('userid')
      if (isEmpty($answer)){
         $errorplace.innerHTML = "Answer field cannot be empty"
         displayError();
      }
      else {
         var question_id = getQuestionId();
         const data = {
            user_id: $user_id,
            description: $answer
         }
         fetch(`${API}/questions/${question_id}/answers`, {
            method: 'POST',
            headers:{
               'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data)
         }).then(response => response.json()).then(result => {
              redirect(`question.html?q=${question_id}`)
         })
      }
   }
   
})

const loadRelatedQuestions = ()  => {
   var id = getQuestionId()
   fetchSingleQuestion(id).then(resp => {
      fetch(`${API}/search/questions?s=${resp.title}`)
      .then(response => response.json())
      .then(results => {
         if(results.message){
            $('#related').append('no related question')
         }
         else{
            if (results.length > 8){
               for(var i = 0;i < 8;i++){
                  $('#related').append(`<li><a href="question.html?q=${results[i]._id}">${results[i].title}</li>`);
               }
            }else{
               results.forEach(result  => {
                  $('#related').append(`<li><a href="question.html?q=${result._id}">${result.title}</li>`)
               })
            }
         }
      })
   })
}


window.onload = () => {
   loadQuestionWithAnswers();
   loadRelatedQuestions()
}