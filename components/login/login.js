async function login() {

  const email = document.getElementById("email").value;
  const pass = document.getElementById('password').value;
  const message = document.getElementById('message');

  message.classList.remove('error');
  message.innerText = "Loading...";
  const data = {
    "password": pass,
    "email": email,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  };

  let response = await fetch('http://localhost:3000/api/users/login',options);
  const json = await response.json();

  if(response.ok) {
    alert("Привет " + json.name);

    fetch('http://localhost:3000/api/users/login', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    message.innerText = "Success";
    window.localStorage.setItem("key", response.headers.get('x-auth-token'));
  }
  else{
    message.classList.add("error");
    message.innerText = json;
  }
}
const form = document.getElementById("form");
form.addEventListener("submit", function(e) {
  e.preventDefault();
  login();
});