message = document.getElementById('message');

async function sign() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  let error = false;
  let errorText = '';

  message.innerText = "Loading...";
  if (pass.length < 8) {
    error = true;
    errorText += "Passwords must be more than 8 characters";
  }
  if (!error) {
    const data = {
      "password": pass,
      "email": email,
      "name": name
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/', options);
    return response;
  }
  else{
    message.innerHTML = errorText;
  }
}
const form = document.getElementById("form");
form.addEventListener("submit", function(e) {
  e.preventDefault();
  sign().then(r => {
    if (r.ok){
      message.innerHTML = "Successful";
    }
    else{

    }
  });
});