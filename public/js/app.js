const sendForm = document.querySelector("#send-form");
let input = document.querySelector("#message");
const messagesBox = document.querySelector(".messages-box");
const btnOut = document.querySelector(".btn2");
const userList = document.querySelector(".users-list");
let username = localStorage.getItem("username");
let chatName = document.querySelector("#chat-name");
let ip4 = '192.168.1.4'
const getUsers = async () => {
    userList.innerHTML = null;
    let res = await fetch(`http://${ip4}:4200/users/${username}`);
    let users = await res.json();
    for (let el of users) {
        let li = document.createElement("li");
        let img = document.createElement("img");
        li.dataset.id = el.id;
        img.src = "https://picsum.photos/id/1/50/50";
        li.classList.add("user-item");
        li.textContent = el.username;
        li.prepend(img);
        userList.appendChild(li);

        li.onclick = async (event) => {
            let fId = localStorage.getItem("id");
            let sId = event.target.dataset.id;
            chatName.textContent = event.target.textContent;
            localStorage.setItem('sUsername', chatName.textContent);
            let response = await fetch(
                `http://${ip4}:4200/get/roomId/${fId}/${sId}`
            );
            let room = await response.json();
            localStorage.setItem("sId", sId);
            localStorage.setItem("roomId", room.roomId);
            renderMessages(room.messages);
        };
    }
};
getUsers();

function renderMessages(array) {
    messagesBox.innerHTML = null;
    for (let el of array) {
        let element = el.type === "text" ? "p" : "img";
        let elClass = el.username === username ? "my-message" : "message";
        element = document.createElement(element);
        element.textContent = el.message;
        element.classList.add(elClass);
        messagesBox.appendChild(element);
    }
}

messagesBox.scrollTop = messagesBox.scrollHeight;

sendForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (input.value !== "") {
        let roomId = localStorage.getItem("roomId");
        let username = localStorage.getItem("username");
        console.log(roomId);
        let response = await fetch(
            `http://${ip4}:4200/sendMessage/${roomId}/${username}/text`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input.value }),
            }
        );
        console.log(response.status);
        let p = document.createElement("p");
        p.classList.add("my-message");
        p.textContent = input.value;
        messagesBox.appendChild(p);
        input.value = "";
    }

    messagesBox.scrollTop = messagesBox.scrollHeight;
});

btnOut.onclick = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem('sId');
    localStorage.removeItem('roomId');
    localStorage.removeItem('sUsername');
    window.location = "/index.html";
};


 async function startMessaging(){

    let sUsername = localStorage.getItem('sUsername');
    let id = localStorage.getItem('id');
    let sId = localStorage.getItem('sId');
    let roomId = localStorage.getItem('roomId');
    chatName.textContent = sUsername;
    if(sUsername && sId && roomId) {
        let response = await fetch(
            `http://${ip4}:4200/get/roomId/${id}/${sId}`
        );
        let room = await response.json();
        renderMessages(room.messages);
    }else{
        messagesBox.innerHTML = null;
        let p = document.createElement('p');
        p.classList.add('start-message');
        p.textContent = 'Select a chat to start messaging'
        messagesBox.appendChild(p);
    }
}

startMessaging();