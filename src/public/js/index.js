const setCurrentQuestion = (id) => {
   localStorage.setItem('question_id', id);
}
const $content = document.querySelector('#postcontent');
const $head = document.querySelector("#head");

const fetchAllQuestions = () => {
  return fetch(`${API}/questions`,{
     headers:{
        'X-Access-Token':localStorage.getItem('token')
     }
  })
   .then(resp => resp.json());
}
const fetchSeachedQuestions = (query) => {
   return fetch(`${API}/search/questions?s=${query}`)
    .then(resp => resp.json());
}


const loadRecentQuestions = () => {
   localStorage.removeItem('question_id');
   $head.innerHTML = `Recently Asked`
   fetchAllQuestions().then(results => {
      results.forEach(result => {
         $content.innerHTML += `<div class="post col-xl-12">
         <div class="post-details"></div>
         <div class="post-meta d-flex justify-content-between">
            <div class="date meta-last">${result.date_posted}</div>
            <div class="category"><a href="#"></a></div>
         </div><a id="${result._id}"  href="question.html?q=${result._id}">
         <h3  class="h5">${result.title}</h3></a>
         <div class="post-footer d-flex align-items-center"><a href="#" class="author d-flex align-items-center flex-wrap">
         <div class="title">by <span>${result.user.name}</span><span>(@${result.user.username})</span></div></a>
         <div class="date"><i class="fa fa-tags"></i>${result.tags}</div>
         
         </div>
         <hr>
         </div>`;
         
      });
   })

   
   
}

if (window.location.pathname.includes("index.html") && !window.location.search){
   loadRecentQuestions();
}
