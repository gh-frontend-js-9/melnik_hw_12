email = document.getElementById("email");
pass = document.getElementById('password');
message = document.getElementById('message');

if (localStorage.token)
window.location.href = "components/messages/messages.html";


async function login(email, pass) {
    const data = {
        "email": email,
        "password": pass
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/login', options);
    const json = await response.json();
    return {'response': response, 'json': json};
}

const form = document.getElementById("form");
form.addEventListener("submit", function (e) {
    e.preventDefault();
    message.classList.remove('error');
    message.innerText = "Loading...";
    login(email.value, pass.value).then(r =>{
        if (r.response.ok) {
            message.innerText = "Success";
            window.localStorage.setItem("token", r.response.headers.get('x-auth-token'));
            window.localStorage.setItem("_id", r.json._id);
            window.location.href = "components/messages/messages.html";
        } else {
            message.classList.add("error");
            message.innerText = r.json.message;
        }
    });
});