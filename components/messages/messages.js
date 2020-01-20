class HTMLRender {
    static render(options) {
        let {tags, className = [], text, title, value} = options;
        let elem = document.createElement(tags);
        elem.classList.add(...className);
        elem.textContent = text;
        if (title != '')
            elem.setAttribute(title, value);
        return elem;
    }
}

let currentThread = {
    "_id": 0,
    "users": {
        "me": [],
        'user': []
    },
    'idUser': ''
}
if (!localStorage.token)
    window.location.href = "../login/login.html";

async function getUserById(_id) {
    const options = {
        method: 'GET',
        headers: {
            'x-access-token': localStorage.token,
        }
    };
    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/' + _id, options);
    return await response.json();
}

async function getCurrentUser() {
    const options = {
        method: 'GET',
        headers: {
            'x-access-token': localStorage.token,
        }
    };
    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/', options);
    return await response.json();
}

async function _createThread(_id) {
    const obj = {
        "user": {
            "_id": _id
        }
    };
    const options = {
        method: 'POST',
        headers: {
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    };
    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads', options);
    return await response.json();
}

async function getAllUsers() {
    const options = {
        method: 'GET',
        headers: {
            'x-access-token': localStorage.token
        },
    };
    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/all', options);
    return await response.json();
}

async function getThreads() {

    const options = {
        method: 'GET',
        headers: {
            'Authorization': localStorage.token
        },
    };

    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads', options);
    return await response.json();
}

async function getThreadMessages(_id) {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        }
    };

    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages/' + _id, options);
    return await response.json();
}

async function sendMessage(_id, text) {
    const obj = {
        "thread": {
            "_id": _id
        },
        "message": {
            "body": text
        }
    };
    const options = {
        method: 'POST',
        headers: {
            'Authorization': localStorage.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    };

    let response = await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages', options);
    return await response.json();
}

function getThread() {
    let dialogsBlock = document.getElementById('dialogs');
    dialogsBlock.innerHTML = "";
    let usersTmp = [], users = [], me = [];
    getAllUsers().then(response => {
        response.map(x => usersTmp.push(x));
    });
    getCurrentUser().then(r => me = r);
    getThreads().then(json => {
        for (let i = 0; i < json.length; i++) {
            let thread = json[i];
            let user;

            if (thread.users[1]._id === me._id)
                user = thread.users[0];
            else
                user = thread.users[1];

            users.push(user);
            renderThread(user.name, '', thread._id, "getThreadMessage");
        }
        renderCreateThread();
        let result = removeUsers(usersTmp, users, me);
        result.map(user => {
            renderThread(user.name, "", user._id, "createThread")
        });
    });
}

function removeUsers(arr1, arr2, me) {
    let _tmp = [];
    arr1.forEach(element => {
        let q = 0;
        arr2.forEach(element2 => {
            if (element._id === element2._id || element._id === me._id)
                q++;
        });
        if (q === 0)
            _tmp.push(element);
    });
    return _tmp;
}

getThread();

function createThread(_id) {
    _createThread(_id).then(r => {
        getThread();
        currentThread = r;
        currentThread.idUser = _id;
    });
}

function getThreadMessage(_id) {
    getCurrentUser().then(r => currentThread.me = r);
    getThreads().then(r => {
        r.filter(x => {
            if (x._id === _id) {
                if (x.users[0]._id === currentThread.me._id)
                    currentThread.idUser = x.users[1]._id;
                else
                    currentThread.idUser = x.users[0]._id;

            }
        });
        getUserById(currentThread.idUser).then(r => {
            currentThread.user = r;
            getThreadMessages(_id).then(data => {
                let dialogMessagesBlock = document.getElementById('dialog-messages');
                let form = document.getElementById('form');
                let message = document.getElementById('message');
                dialogMessagesBlock.innerHTML = "";
                data.map(x => {
                    renderThreadMessage(x.body, x.user, currentThread.me);
                });

                dialogMessagesBlock.scrollTop = dialogMessagesBlock.scrollHeight;

                renderUserInfo(currentThread.user);
                message.style.display = 'block';
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    sendMessage(_id, message.value).then(r => {
                        renderThreadMessage(message.value, currentThread.me, currentThread.me);
                        message.value = "";
                        dialogMessagesBlock.scrollTop = dialogMessagesBlock.scrollHeight;
                    });
                });
            });
        });
    });

}

function renderUserInfo(user) {
    let userImg = HTMLRender.render({
        tags: 'img',
        className: ['user-info__avatar'],
        title: 'src',
        value: '../../assets/images/user1.jpg'
    });
    let userName = HTMLRender.render({
        tags: 'p',
        className: ['user-info__name'],
        text: user.name
    });
    let userWork = HTMLRender.render({
        tags: 'p',
        className: ['work'],
        text: user.position
    });
    let userDesc = HTMLRender.render({
        tags: 'p',
        className: ['desc'],
        text: user.description
    });
    let userEmailT = HTMLRender.render({
        tags: 'p',
        className: ['title'],
        text: 'Email'
    });
    let userEmail = HTMLRender.render({
        tags: 'p',
        className: ['text'],
        text: user.email
    });
    let userPhoneT = HTMLRender.render({
        tags: 'p',
        className: ['title'],
        text: 'Phone'
    });
    let userPhone = HTMLRender.render({
        tags: 'p',
        className: ['text'],
        text: user.phone
    });
    let userAddressT = HTMLRender.render({
        tags: 'p',
        className: ['title'],
        text: 'Address'
    });
    let userAddress = HTMLRender.render({
        tags: 'p',
        className: ['text'],
        text: user.address
    });
    let userOrgT = HTMLRender.render({
        tags: 'p',
        className: ['title'],
        text: 'Organization'
    });
    let userOrg = HTMLRender.render({
        tags: 'p',
        className: ['text'],
        text: user.organization
    });
    userDiv = document.getElementById('user_info');
    userDiv.innerHTML = "";
    userDiv.append(userImg);
    userDiv.append(userName);
    userDiv.append(userWork);
    userDiv.append(userDesc);
    userDiv.append(userEmailT);
    userDiv.append(userEmail);
    userDiv.append(userPhoneT);
    userDiv.append(userPhone);
    userDiv.append(userAddressT);
    userDiv.append(userAddress);
    userDiv.append(userOrgT);
    userDiv.append(userOrg);
}

function renderThreadMessage(text, author, me) {
    let messageItemDiv, messageItemImg;
    if (author._id === me._id) {
        messageItemDiv = HTMLRender.render({
            tags: 'div',
            className: ['dialog-message', 'my'],
        });
        messageItemImg = HTMLRender.render({
            tags: 'img',
            title: 'src',
            value: '../../assets/images/user2.jpg'
        });
    } else {
        messageItemDiv = HTMLRender.render({
            tags: 'div',
            className: ['dialog-message'],
        });
        messageItemImg = HTMLRender.render({
            tags: 'img',
            title: 'src',
            value: '../../assets/images/user1.jpg'
        });
    }
    let dialogItemP = HTMLRender.render({
        tags: 'p',
        text: text
    });
    messageItemDiv.append(messageItemImg);
    messageItemDiv.append(dialogItemP);
    let dialogMessagesBlock = document.getElementById('dialog-messages');
    dialogMessagesBlock.append(messageItemDiv);
}

function renderCreateThread() {
    let button = HTMLRender.render({
        tags: 'button',
        className: ['dialogs-add'],
    });
    let i = HTMLRender.render({
        tags: 'i',
        className: ['fas', 'fa-plus']
    });
    let dialogsBlock = document.getElementById('dialogs');
    button.append(i);
    button.append('\nNew coversation');
    dialogsBlock.append(button);
}

function renderThread(name, message, _id, functionStr) {
    let dialogsItemDiv = HTMLRender.render({
        tags: 'div',
        className: ['dialogs-item'],
        title: 'onclick',
        value: functionStr + '("' + _id + '")'
    });
    let dialogsItemPersonDiv = HTMLRender.render({
        tags: 'div',
        className: ['dialogs-item__person'],
    });
    let dialogsItemPersonImg = HTMLRender.render({
        tags: 'img',
        className: ['dialogs__avatar'],
        title: 'src',
        value: '../../assets/images/user1.jpg'
    });
    let dialogsItemPersonSpan = HTMLRender.render({
        tags: 'span',
        className: ['dialog__name'],
        text: name
    });
    let dialogsMessageP = HTMLRender.render({
        tags: 'p',
        text: message
    });
    let dialogsBlock = document.getElementById('dialogs');
    dialogsItemPersonDiv.append(dialogsItemPersonImg);
    dialogsItemPersonDiv.append(dialogsItemPersonSpan);
    dialogsItemDiv.append(dialogsItemPersonDiv);
    dialogsItemDiv.append(dialogsMessageP);
    dialogsBlock.append(dialogsItemDiv);
}