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

async function threads() {

    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTEzMGJmZTliNjEwYTgzNjNiNGIzMTkiLCJpYXQiOjE1NzgzNDI5Mzh9.09dZkCRoebOXgreM-MV9NjwK3puc2NYvb21WUKkT_nE'
        },
    };

    let response = await fetch('http://localhost:3000/api/threads', options);
    const json = await response.json();
    for (let i = 0; i < json.length; i++) {
        let name;
        if (!json[i].users[1].me)
            name = json[i].users[1].name;
        else
            name = json[i].users[0].name;
        let lastMessage = json[i].last_message.body;
        renderThread(name, lastMessage);
    }
    renderNewThreadBtn();
}

async function getThreadMessages() {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTEzMGJmZTliNjEwYTgzNjNiNGIzMTkiLCJpYXQiOjE1NzgzNDI5Mzh9.09dZkCRoebOXgreM-MV9NjwK3puc2NYvb21WUKkT_nE'
        },
        body: {
            "thread": {
                "_id": "5e13343a5badff9ccfb36767"
            }
        }
    };

    let response = await fetch('http://localhost:3000/api/threads/messages', options);

    const json = await response.json();
    console.log(json);
}

threads();
getThreadMessages();

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

function renderThread(name, message) {
    let dialogsItemDiv = HTMLRender.render({
        tags: 'div',
        className: ['dialogs-item'],
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