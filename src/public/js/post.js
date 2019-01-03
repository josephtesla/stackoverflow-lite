if (!localStorage.getItem('userid')){
   redirect('login.html')
}
var $postBtn = document.getElementById('postBtn');

$postBtn.addEventListener('click', function(event){
   event.preventDefault();
   var $title = document.querySelector('#title').value;
   var $description = document.querySelector("#description").value;
   var $tags = document.querySelector("#tags").value;
   if( isEmpty($title) || isEmpty($description)){
      $errorplace.innerHTML = "Form has errors.. fill fields correctly";
      displayError();
   }
   else{
      const formData = {
         title:$title,
         description:$description,
         tags:$tags,
         user_id:localStorage.getItem('userid')
      }
      fetch(`${API}/questions`, {
         method: 'POST',
         headers:{
            'Content-Type': 'application/json; charset=utf-8'
         },
         mode: 'cors', 
         cache: 'no-cache', 
         credentials: 'same-origin', 
         redirect: 'follow',
         referrer: 'no-referrer',
         body: JSON.stringify(formData)
      })
      .then(response => response.json()).then(result => {
         if (result.message) {
            $errorplace.innerHTML = result.message
            displayError()
         }
         else{
            redirect('index.html')
         }
      })
   }

   
})