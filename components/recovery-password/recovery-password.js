async function recoverPass() {

    const pass = document.getElementById("password").value;
    const pass2 = document.getElementById('password2').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message');
    let error = false;
    let errorText = '';

    message.innerText = "Loading...";
    message.classList.remove('error');
    if (pass !== pass2) {
        error = true;
        errorText = "Passwords do not match <br>";
    }
    if (pass.length < 8) {
        error = true;
        errorText += "Passwords must be more than 8 characters";
    }
    if (!error) {
        const data = {
            "password": pass,
            "confirmationPassword": pass2,
            "email": email,
        };
        console.log(data);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/reset_password', options);
        const json = await response.json();
        if (response.ok) {
            console.log(json);
            message.innerText = "Recover successful";
        } else {
            message.classList.add("error");
            message.innerText = json;
        }
    } else {
        message.innerHTML = errorText;
    }
}

const form = document.getElementById("form");
form.addEventListener("submit", function (e) {
    e.preventDefault();
    recoverPass();
});