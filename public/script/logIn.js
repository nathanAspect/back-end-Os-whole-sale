const form = document.querySelector('form');
const userName = document.querySelector('#userName');
const password = document.querySelector('#password');
const userMis = document.querySelector('.userMis');
const passwordMis = document.querySelector('.passwordMis');
const userIn = document.querySelector('#userName');
const passIn = document.querySelector('#password');

form.addEventListener('submit', event => {
  event.preventDefault();
  const user_name = userName.value;
  const password1 = password.value;

  fetch('http://localhost:3000/admin', {
    method: 'POST',
    body: JSON.stringify({ userName: user_name, password: password1 }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
       if(data.response===-1){
         userIn.classList.toggle('redBorder');
         userMis.style.opacity = 1;
         setTimeout(()=>{
            userIn.classList.toggle('redBorder');
            userMis.style.opacity = 0;
         }, 2000)
       } else if(data.response===0){
         passIn.classList.toggle('redBorder');
         passwordMis.style.opacity = 1;
         setTimeout(()=>{
            passIn.classList.toggle('redBorder');
            passwordMis.style.opacity = 0;
         }, 2000)
       } else if (data.response === 'authorized') {



          console.log('Bearer ' + data.token);
          fetch('/admin/dashboard', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + data.token
            }
          })
          .then(response => {
            if (response.ok) {
              //window.location.href = '/admin/dashboard';
            } else {
              console.error('Error:', response.statusText);
            }
          })
          .catch(error => console.error(error));



        } else{
          console.log("something went wrong!");
       }
    })
    .catch(err => {
      console.log(err);
    });
});