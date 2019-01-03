const API = 'http://localhost:8000/api/v1';
const $errorplace = document.querySelector('#errorplace');
const $loader = document.querySelector("#loader");

const getQuestionId  = ()  => {
   return window.location.search.substr(3)
}

const fetchParams = (method, body) => (
   {
      method: method,
      headers:{
         'Content-Type': 'application/json; charset=utf-8'
      },
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(body)
   })


const spinner = () => {
   $loader.style.display = 'none';
}

const showSpinnerBeforeLoad = ()  => {
   setTimeout(spinner, 1200);
   $("#fullbody").toggle(1000)
}

showSpinnerBeforeLoad();

const displayError = () => {
   $errorplace.style.display = "block";
   $("#errorplace").fadeOut(4000);
}

if (localStorage.getItem('userid')){
   var username = localStorage.getItem('username');
   $('#navuser').append(`
   <li class="nav-item">
   <a class="nav-link waves-effect" href="profile.html?u=${username}" >View profile</a>
   </li>`)
}

const redirect = (url) => {
   window.location.href = url;
}

const isEmpty = (element) => {
   if (element == "") return true;
      return false;
}
const splitTags = (tags) => {
   return tags.split(',');
}  

const displayTags = (tags) => {
   var tagsArr = splitTags(tags)
   var newTags = ``;
   tagsArr.forEach(tag => {
      newTags +=`<a href="#" class="tag">#${tag}</a>`;
   });
   return newTags;
}

//display Upvote button if ONLY user is logged in
const displayUpvoters = (ans_id, upvotes) => {
   
   if (localStorage.getItem('userid')){
      var user_id = localStorage.getItem('userid')
      fetch(`${API}/answers/${ans_id}`).then(response => response.json())
      .then(answers => {
         if (answers.upvoters.includes(`${user_id}`)){
            var html = `<span id="upvoter${ans_id}" >
            upvoted<i class="fa fa-check-square-o">
            </i><span id="">${upvotes}</span> |
            <a  id="upvoter${ans_id}" onclick="upvoteAnswer('${ans_id}')">
            <span class="blue1">downvote</span </a>`;
            $(`#list${ans_id}`).append(html)
         }
         else{
            var html =  `<a id="upvoter${ans_id}" onclick="upvoteAnswer('${ans_id}')">
            <span class="blue1">upvote <i class="fa fa-check-square-o">
            </i></span> <span id="">${upvotes}</span></a>`
            $(`#list${ans_id}`).append(html)
         }
      })
   }
   else{
      var html = `<span id="upvoter${ans_id}" >
      upvotes <i class="fa fa-check-square-o">
      </i><span id="">${upvotes}</span>`;
      $(`#list${ans_id}`).append(html)
   }

   
}


if (localStorage.getItem('userid')){
   document.querySelector('#userone').innerHTML = `
   <a href="#" class="nav-link border border-light rounded waves-effect">
   <i class="fa fa-user"></i> Signed in as @${localStorage.getItem('username')}</a>`
   document.querySelector('#usertwo').innerHTML =  `
   <a href="#" id="logout" class="nav-link border border-light rounded waves-effect">
   <i class="fa fa-user"></i>Logout</a>`
}

//if there is a logout button
if (!!document.querySelector("#logout")){
   document.querySelector('#logout').addEventListener('click', function(e){
      e.preventDefault();
      localStorage.removeItem('userid');
      localStorage.removeItem('username');
      redirect("index.html")
      
   })
}

document.querySelector("#askbutton").addEventListener('click', function(e){
   e.preventDefault();
   if (!localStorage.getItem('userid')){
      alert('You must Login to proceed');
   }
   else{
      redirect("post.html")
   }
})

const toggleForm = (ans_id) => {
   $(`#${ans_id}`).fadeToggle(10);
}
const toggleComments = (ans_id) => {
   $(`#comment${ans_id}`).fadeToggle(10);
}

//implement searching feature

const loadSearchedQuestion = (query) => {
   fetch(`${API}/search/questions?s=${query}`)
   .then(response => response.json())
   .then(results => {
      $head.innerHTML = `Search Results for: '${query}'`;
      $('title').html(`Search Results for: '${query}'`);
      if (results.message){
         document.querySelector('#search-status').innerHTML = results.message
         $("#search-status").show();
      }
      else {
         results.forEach(result => {
            $content.innerHTML += `<div class="post col-xl-12">
            <div class="post-details"></div>
            <div class="post-meta d-flex justify-content-between">
               <div class="date meta-last">${result.date_posted}</div>
               <div class="category"><a href="#"></a></div>
            </div><a id="${result._id}"  href="question.html?q=${result._id}">
            <h3 onclick='setCurrentQuestion("${result._id.toString()}")' class="h5">${result.title}</h3></a>
            <div class="post-footer d-flex align-items-center"><a href="#" class="author d-flex align-items-center flex-wrap">
            <div class="title"><span>${result.user.name}</span><span>(@${result.user.username})</span></div></a>
            <div class="date"><i class="fa fa-tags"></i>${result.tags}</div>
            
            </div>
            <hr>
            </div>`;
            
         });
      }
   })
}

if (window.location.search && window.location.search.includes('search')){
   var fullArray = window.location.search.split('+');
   var firstword = fullArray[0].toString().substr(8);
   delete fullArray[0];
   fullArray[0] = firstword;
   var searchQuery = fullArray.join(' ');
   loadSearchedQuestion(searchQuery);
   
}

const authBeforeProceed = (id) => {
   if (!localStorage.getItem('userid')){
      alert('You must Login to proceed!')
      redirect(`question.html?q=${id}`)
   }
}

const postNewComment = (ans_id) => {
  var commentText = document.getElementById(`text${ans_id}`).value;
  var question_id = getQuestionId();
  if (isEmpty(commentText)){
     $(`error${ans_id}`).html("Pls enter your comment!");
     $(`error${ans_id}`).show()
  }
  else {
   const commentData = {
      user_id:localStorage.getItem('userid'),
      text:commentText
   }
   fetch(`${API}/answers/${question_id}/${ans_id}/comments`,fetchParams('POST',commentData))
   .then(response => response.json())
      .then(() => {
      redirect(`question.html?q=${question_id}`)
      })
  }
}


const upvoteAnswer = (ans_id, upvotes) => {
   var user_id = localStorage.getItem('userid')
   var question_id = getQuestionId();
  
   fetch(`${API}/answers/${ans_id}`).then(response => response.json())
   .then(answers => {
      //if user already voted, downvote
      if (answers.upvoters.includes(`${user_id}`)){
         fetch(`${API}/answers/${ans_id}/${user_id}/downvote`,fetchParams('PUT'))
         .then(response => response.json())
         .then((row) => {
            $(`#list${ans_id}`).html('');
            //update page without reloading
            var html =  `<a id="upvoter${ans_id}" onclick="upvoteAnswer('${ans_id}')">
            <span class="blue1">upvote</span> <i class="fa fa-check-square-o">
                     </i><span id="">${row.result.upvotes}</span></a>`
            $(`#list${ans_id}`).append(html);
            $(`#upvotes-lg${ans_id}`).html(row.result.upvotes)
            
         })
      }
      else{
         fetch(`${API}/answers/${ans_id}/${user_id}/upvote`,fetchParams('PUT'))
         .then(response => response.json())
         .then((row) => {
            $(`#list${ans_id}`).html('');
            var html = `<span id="upvoter${ans_id}" >
            upvoted<i class="fa fa-check-square-o">
            </i><span id="">${row.result.upvotes}</span> |
            <a  id="upvoter${ans_id}" onclick="upvoteAnswer('${ans_id}')">
            <span class="blue1">downvote</span </a>`;
            $(`#list${ans_id}`).append(html)
            $(`#upvotes-lg${ans_id}`).html(row.result.upvotes)
            
         })
      }
   })
   
   
}