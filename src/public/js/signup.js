var $signupBtn = document.getElementById('signupBtn');

$signupBtn.addEventListener('click', function(event){
   event.preventDefault();
   var $name = document.querySelector('#fullname').value;
   var $username = document.querySelector('#username').value;
   var $password = document.querySelector("#password").value;
   var $password2 = document.querySelector('#password2').value;
   if(isEmpty($name) || isEmpty($username) || isEmpty($password) || isEmpty($password2)  ){
      $errorplace.innerHTML = "Form has errors.. fill fields correctly";
      displayError();
   }
   else if ($password.length < 8){
      $errorplace.innerHTML = "enter at least 8 characters for password"
      displayError();
   }
   else if ($password != $password2){
      errorplace.innerHTML ="passwords do not match"
      displayError();
   }
   else{
      const formData = {
         name:$name,
         username:$username,
         password:$password
      }
      console.log(formData)
      fetch(`${API}/auth/register`,fetchParams('POST', formData))
      .then(response => response.json()).then(result => {
         console.log(result);
         if (result.message) {
            $errorplace.innerHTML = result.message
            displayError()
         }
         if (result.user){
            localStorage.setItem('token',result.token);
            localStorage.setItem('userid',result.user._id);
            localStorage.setItem('username',result.user.username);
            redirect("index.html");
         }
      })
   }

   
})