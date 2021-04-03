let form1 = document.querySelector("#form1");
let usernameValue = document.querySelector("#username");
let passwordValue = document.querySelector("#password");
let errRender = document.querySelector("#errRender");
let ip4 = '192.168.1.4'
form1.onsubmit = async (event) => {
    event.preventDefault();
    let obj = {username: usernameValue.value, password: passwordValue.value }
    
    let response = await fetch(`http://${ip4}:4200/signup`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    }); 
    if(response.status === 400 || response.status === 404){
       errRender.classList.add('alert-danger');
       let mesRes = await response.json();
       errRender.textContent = mesRes.message;
    }else{
        let obj = await response.json();
        localStorage.setItem('username', obj.username);
        localStorage.setItem('id', obj.id);
        window.location = "/";
    }
};