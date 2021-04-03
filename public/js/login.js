let form = document.querySelector("#form");
let usernameValue = document.querySelector("#username");
let passwordValue = document.querySelector("#password");
let errorRender = document.querySelector("#errorRender");
let ip4 = '192.168.1.4'
form.onsubmit = async (event) => {
    event.preventDefault();
    let obj = {username: usernameValue.value, password: passwordValue.value }
    
    let response = await fetch(`http://${ip4}:4200/login`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    if(response.status === 400 || response.status === 404){
        let resMessage = await response.json();
        errorRender.classList.add('alert-danger');
        errorRender.textContent = resMessage.message;
    }else{
        usernameValue.value = ''
        passwordValue.value = ''
        let res = await response.json();
        localStorage.setItem('username', res.username);
        localStorage.setItem('id', res.id);
        window.location = "/index.html"
    }
}