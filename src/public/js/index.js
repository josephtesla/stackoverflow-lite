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
   var page = window.location.search.substr(6) || 1;
   var perPage = 10;
   fetch(`${API}/questions/${page}/${perPage}`)
   .then(resp => resp.json())
   .then(results => {
      $head.innerHTML = `Recently Asked`
      results.questions.forEach(result => {
         $content.innerHTML += `<div class="post col-xl-12">
         <div class="post-details"></div>
         <div class="post-meta d-flex justify-content-between">
         <div class="date meta-last">
         ${displayTime(result.date_posted,result.date_secs)}</div>
         <div class="category"><a href="#"></a></div>
         </div><a id="${result._id}"  href="question.html?q=${result._id}">
         <b>${result.title}</b>
         <div class="post-footer d-flex align-items-center">
         <a href="#" class="author d-flex align-items-center flex-wrap">
         <div class="title">by <span>${result.user.name}</span>
         <span>(@${result.user.username})</span></div></a>
         <div class="date"><i class="fa fa-tags"></i>${result.tags}</div>
         </div>
         <hr>
         </div>`;
      });
      var current = results.current;
      var pages = results.pages;
      if (pages > 0){
         if (current == 1){
            $('#paginator').append('<li class="disabled"><a>First</a></li>')
         }
         else{
            $('#paginator').append('<li><a href="index.html?page=1">First</a></li>');
         }
         var i = (Number(current) > 5? Number(current) - 4: 1)
         if (i !== 1){
            $('#paginator').append('<li class="disabled"><a>...</a></li> ')
         }
         for (;i <= (Number(current) + 4) && i <= pages;i++){
            if (i == current){
               console.log(i);
               $('#paginator').append(`<li class="page-item"><a>${i}</a></li>`);
            }
            else{
               $('#paginator').append(`<li class="page-item"><a href="index.html?page=${i}">${i}</a></li>`)
            }
            if (i == Number(current) + 4 && i < pages){
               $('#paginator').append('<li class="page-time disabled"><a>...</a></li>')
            }
         }
         if (current == pages){
            $('#paginator').append('<li class="page-item disabled"><a>Last</a></li> ')
         }
         else {
            $('#paginator').append(`<li class="page-item"><a href="index.html?page=${pages}">Last</a></li>`);
         }
      }
   }).catch(err => {
      console.log(err)
   })
   
   
}

if (window.location.pathname.includes("index.html") && !window.location.search.includes('search')){
   loadRecentQuestions();
}
