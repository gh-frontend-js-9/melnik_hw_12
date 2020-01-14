class HTMLRender {
    static render(options) {
        let {tags, className = [], text, title, value} = options;
        let elem = document.createElement(tags);
        elem.classList.add(...className);
        elem.textContent = text;
        elem.setAttribute(title, value);
        return elem;
    }
}
if(!localStorage.token)
    window.location.href = "../login/login.html";

async function getThreads() {

    const options = {
        method: 'GET',
        headers: {
            'Authorization': localStorage.token
        },
    };

    let response = await fetch('http://localhost:3000/api/threads', options);
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

    let response = await fetch('http://localhost:3000/api/threads/messages/' + _id, options);

    return await response.json();
}

async function sendMessage(_id, text) {

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTEzMGJmZTliNjEwYTgzNjNiNGIzMTkiLCJpYXQiOjE1NzgzNDI5Mzh9.09dZkCRoebOXgreM-MV9NjwK3puc2NYvb21WUKkT_nE',
            'Content-Type': 'application/json'
        },
        body: {
            "thread": {
                "_id": _id
            },
            "message": {
                "body": text
            }
        }
    };

    let response = await fetch('http://localhost:3000/api/threads/messages', options);

    return await response.json();
}

getThreads().then(json => {
    for (let i = 0; i < json.length; i++) {
        let thread = json[i];
        let name;
        if (!thread.users[1].me)
            name = thread.users[1].name;
        else
            name = thread.users[0].name;
        let lastMessage = thread.last_message.body;
        renderThread(name, lastMessage, thread._id);
    }
    renderNewThreadBtn();
});

function getThreadMessage(_id) {
    getThreadMessages(_id).then(data => {
        let me, interlocutor;
        if (data.users[0].me) {
            me = data.users[0]._id;
            interlocutor = 1;
        } else {
            me = data.users[1]._id;
            interlocutor = 0;
        }

        let dialogMessagesBlock = document.getElementById('dialog-messages');
        dialogMessagesBlock.innerHTML = "";
        data.messages.map(x => {
            renderThreadMessage(x.body, x.user, me);
        });
        dialogMessagesBlock.scrollTop = dialogMessagesBlock.scrollHeight;

        renderUserInfo(data.users[interlocutor]);

        let form = document.getElementById('form');
        let message = document.getElementById('message');
        message.style.display = 'block';
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            sendMessage(_id, message.value);
            renderThreadMessage(message.value, me, me);
            message.value = "";
            dialogMessagesBlock.scrollTop = dialogMessagesBlock.scrollHeight;
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
    if (author === me) {
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

function renderNewThreadBtn() {
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

function renderThread(name, message, _id) {
    let dialogsItemDiv = HTMLRender.render({
        tags: 'div',
        className: ['dialogs-item'],
        title: 'onclick',
        value: 'getThreadMessage("' + _id + '")'
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