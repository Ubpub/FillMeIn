// Patrones para el correo y la fecha
const patrones = {
    'email': /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
    'fecha': /^([1-2][0-9]{3})\-(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[0-1])$/,
};

let user = {};

if (localStorage.getItem('webToken') != null) {
    document.title = `FillMeIn - ${ localStorage.getItem('username') }`
    loadElement()
}

function loadElement() {
    // Comprueba si tiene foto de perfil
    let user_photo = document.querySelector('#user-photo');
    if (localStorage.getItem('image') == 'Gray') user_photo.style.backgroundImage = `url('../imgs/Gray.png')`;
    else {
        user_photo.style.backgroundImage = `url('${ localStorage.getItem('image') }')`;
        user_photo.style.borderRadius = "50%";
    }

    // Obtiene los valores del usuario
    let username = localStorage.getItem('username');
    getValues(username);

    document.querySelector('#save-bt').addEventListener('click', () => {
        // Obtiene valores
        let username = document.querySelector('#username-input').value;
        let name = document.querySelector('#user-input').value;
        let biography = document.querySelector('#biography-input').value;
        if (biography == "" || biography == null)
            biography = null;
        if (biography != null) {
            biography = filterSymbols(biography);
        }
        let email = document.querySelector('#email-input').value;
        let birthday = document.querySelector('#birthday-input').value;
        if (birthday == "" || birthday == null)
            birthday = null;
        let pass = document.querySelector('#password-input').value;
        let repeat_pass = document.querySelector('#repeat-password-input').value;

        // Comprueba los valores
        let valid = checkValues(username, name, email, birthday, pass, repeat_pass);

        if (valid) {
            let user = createUserJSON(username, name, biography, email, birthday, pass);
            editUser(user);
        }
    })
}

function getValues(username) {
    let url = (`http://localhost/FillMeIn/api/usuario.php?username=${ username }`);
    fetch( url )
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                case 404:
                    console.log("ERROR");
            }
        })
        .then(data => {
            if (data[0]) {
                if (data[0] != null) {
                    // Objeto con información del usuario y mostrar en la página
                    user = {
                        'id': data[0]['id'],
                        'username': data[0]['username'],
                    };
                    if (data[0]['banner']) {
                        document.querySelector('#banner').style.backgroundImage = `url('${ data[0]['banner'] }')`;
                    }
                    document.querySelector('#user-input').value = `${ data[0]['name'] }`;
                    document.querySelector('#username-input').value = `${ data[0]['username'] }`;
                    if (data[0]['biography'] != null || data[0]['biography'] != "") {
                        document.querySelector('#biography-input').value = `${ defilterSymbols(data[0]['biography']) }`;
                    }
                    document.querySelector('#birthday-input').value = `${ data[0]['birthday'] }`;
                    document.querySelector('#email-input').value = `${ data[0]['email'] }`;
                }
            } else {
                console.log("ERROR");
            }
        })
}

function checkValues(username, name, email, birthday, pass, repeat_pass) {
    let valid = true;

    // Comprobar nombre de usuario
    if (username == "") {
        document.querySelector("#username-edit").style.borderBottom = "1px solid red";
        document.querySelector('.alert-username').style.display = "none";
        valid = false;
    } else if (username.length < 5) {
        document.querySelector("#username-edit").style.borderBottom = "1px solid red";
        document.querySelector('.alert-username').style.display = "block";
        valid = false;
    } else {
        document.querySelector("#username-edit").style.borderBottom = "1px solid white";
        document.querySelector('.alert-username').style.display = "none";
    }

    // Comprobación del nombre
    if (name == "") {
        document.querySelector("#user-edit").style.borderBottom = "1px solid red";
        valid = false;
    } else {
        document.querySelector("#user-edit").style.borderBottom = "1px solid white";
    }

    // Comprobación del correo
    if (email == "") {
        document.querySelector("#email-edit").style.borderBottom = "1px solid red";
        document.querySelector('.alert-email').style.display = "none";
        valid = false;
    } else if (email != "" && !patrones['email'].test(email)) {
        document.querySelector("#email-edit").style.borderBottom = "1px solid red";
        document.querySelector('.alert-email').style.display = "block";
        valid = false;
    } else {
        document.querySelector("#email-edit").style.borderBottom = "1px solid white";
        document.querySelector('.alert-email').style.display = "none";
    }

    // Comprobación de fecha
    if (birthday != "" && !patrones['fecha'].test(birthday)) {
        document.querySelector("#birthday-edit").style.borderBottom = "1px solid red";
        document.querySelector('.alert-birthday').style.display = "block";
        valid = false;
    } else {
        document.querySelector("#birthday-edit").style.borderBottom = "1px solid white";
        document.querySelector('.alert-birthday').style.display = "none";
    }

    // Comprobación de la contraseña
    if (pass == "" || pass.length < 6) {
        document.querySelector("#password-edit").style.borderBottom = "1px solid red";
        valid = false;
    } else {
        document.querySelector("#password-edit").style.borderBottom = "1px solid white";
    }

    // Comprobación de la repetición de la contraseña
    if (pass != "" && repeat_pass != "") {
        if (repeat_pass != pass) {
            document.querySelector("#r-password-edit").style.borderBottom = "1px solid red";
            document.querySelector('.alert-pass').style.display = "block";
            valid = false;
        } else {
            document.querySelector("#r-password-edit").style.borderBottom = "1px solid white";
            document.querySelector('.alert-pass').style.display = "none";
        }
    } else if (repeat_pass == "") {
        document.querySelector("#r-password-edit").style.borderBottom = "1px solid red";
        document.querySelector('.alert-pass').style.display = "none";
        valid = false;
    }

    return valid;
}

function editUser(user) {
    let url = (`http://localhost/FillMeIn/api/editar.php`);
    fetch( url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json,charset-utf-8'
        },
        body: JSON.stringify(user),
    } )
    .then(response => {
        switch (response.status) {
            case 200:
                return response.json();
            case 404:
                return 400;
            case 409:
                return 409;
        }
    })
    .then(data => {
        // Comprueba los resultados que ha devuelto
        if (data != 409 && data != 400){
            window.location.href = 'user.html';
        } else {
            console.log("Contraseña incorrecta");
        }
    })
}

// Filtra los símbolos del texto para pasarlos a códigos HTML
function filterSymbols(text) {
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/`/g, "&#96;");
    text = text.replace(/´/g, "&acute;");
    text = text.replace(/'/g, "&apos;");
    text = text.replace(/"/g, "&quot;");
    return text
}

// Revierte el filtro realizado para mostrar los valores (en un textarea puede ser)
function defilterSymbols(text) {
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&#96;/g, "`");
    text = text.replace(/&acute;/g, "´");
    text = text.replace(/&apos;/g, "'");
    text = text.replace(/&quot;/g, '"');
    return text
}

function createUserJSON(username, name, biography, email, birthday, pass) {
    return user = {
        "username": username,
        "name": name,
        "biography": biography,
        "email": email,
        "birthday": birthday,
        "pass": pass,
    };
}