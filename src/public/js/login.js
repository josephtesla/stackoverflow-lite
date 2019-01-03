const $loginBtn = document.querySelector('#loginBtn');

$loginBtn.addEventListener('click', function(e){
   e.preventDefault();
   var $username = document.querySelector('#username').value;
   var $password = document.querySelector("#password").value;

   if (isEmpty($username) || isEmpty($password)){
      $errorplace.innerHTML = "Form has errors.. fill fields correctly";
      displayError();
   }
   else{
      const formData = {
         username:$username,
         password:$password
      }
      console.log(formData)
      fetch(`${API}/auth/login`, {
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
      }).then(response => response.json()).then(result => {;
         if (result.message){
            $errorplace.innerHTML = result.message
            displayError()
         }
         if (result.user){
            localStorage.removeItem('token');
            localStorage.setItem('token',result.token);
            localStorage.setItem('userid',result.user._id);
            localStorage.setItem('username',result.user.username);
            redirect("index.html");
         }
      })
   }
})