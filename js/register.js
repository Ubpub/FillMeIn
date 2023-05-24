const patrones = {
    'email': /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
    "fecha": /^([1-2][0-9]{3})\/(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[0-1])$/,
    'pass': /^(?=.*)(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
}

loadElement();

function loadElement() {
    // Función del botón de cuenta profesional
    let btn_profess = document.querySelectorAll('.p-element');
    Array.from(btn_profess).forEach(item => {
        item.addEventListener('click', () => {
            Array.from(btn_profess).forEach(btn => {
                btn.classList.remove('selected');
            })
            item.classList.add('selected');
            if (item.textContent == "NO") {
                document.querySelector(".professional").style.visibility = "hidden";
            } else {
                document.querySelector(".professional").style.visibility = "visible";
            }
        })
    });

    // Mostrar u ocultar la contraseña
    let showPass = document.querySelectorAll(".pass-icon");
    Array.from(showPass).forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("bi-eye-slash")) {
                item.classList.remove("bi-eye-slash");
                item.classList.add("bi-eye");
            } else {
                item.classList.remove("bi-eye");
                item.classList.add("bi-eye-slash");
            }
            let inputPass = null;
            if (item.getAttribute("data-icon")=="pass-icon") {
                inputPass = document.querySelector("input[data-icon=pass-icon]");
            } else {
                inputPass = document.querySelector("input[data-icon=repeat-icon]");
            }
            if (inputPass.type == "password") {
                inputPass.type = "text";
            } else {
                inputPass.type = "password";
            }
        })
    })

    // Función del botón de registro
    let signin = document.querySelector("#register-bt");
    signin.addEventListener("click", () => {
        getValues(); // Obtiene los valores del formulario
    })
}

function getValues() {
    let username = document.querySelector("#username").value;
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#user_mail").value;
    let birthday = document.querySelector("#user_birth").value;
    let pass = document.querySelector("#user_pass").value;
    let repeat_pass = document.querySelector("#pass_repeat").value;
    let isProfessional = document.querySelector(".selected").textContent;

    let type = "none";
    if (isProfessional == "YES") {
        type = document.querySelector("#about").value;
        isProfessional = 1;
    } else {
        type = "none";
        isProfessional = 0;
    }

    let valid = checkValues(username, name, email, birthday, pass, repeat_pass, isProfessional, type);

    if (valid) {
        let user = createUserJSON(username, name, email, birthday, pass, isProfessional, type);

        console.log(JSON.stringify(user));

        // Petición para registrarse
        fetch('http://localhost/FillMeIn/api/usuario.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json,charset-utf-8'
            },
            body: JSON.stringify(user),
        }).then(response => {
            switch(response.status) {
                case 200:
                    console.log("OK");
                    return response.text();
                case 404:
                    console.log("Ha ocurrido un error");
                case 409:
                    document.querySelector("#username").style.border = "1px solid red";
                    document.querySelector('.username-alert').textContent = "Username is already in use";
                    document.querySelector('.username-alert').style.display = "block";
                    console.log("CONFLICTO");
            }
        })
        .then(data => {
            window.location.href = 'home.html';
        })
    }
}

function checkValues(username, name, email, birthday, pass, repeat_pass, isProfessional, type) {

    let valid = true;

    // Comprobación de nombre de usuario
    if (username == "") {
        document.querySelector("#username").style.border = "1px solid red";
        document.querySelector('.username-alert').style.display = "none";
        valid = false;
    } else if (username.length < 5) {
        document.querySelector("#username").style.border = "1px solid red";
        document.querySelector('.username-alert').textContent = "Username must be at least 5 characters long";
        document.querySelector('.username-alert').style.display = "block";
        valid = false;
    } else {
        document.querySelector("#username").style.border = "1px solid white";
        document.querySelector('.username-alert').style.display = "none";
    }

    // Comprobación del nombre
    if (name == "") {
        document.querySelector("#name").style.border = "1px solid red";
        document.querySelector('.name-alert').style.display = "none";
        valid = false;
    } else {
        document.querySelector("#name").style.border = "1px solid white";
        document.querySelector('.name-alert').style.display = "none";
    }

    // Comprobación del correo
    if (email == "") {
        document.querySelector("#user_mail").style.border = "1px solid red";
        document.querySelector('.mail-alert').style.display = "none";
        valid = false;
    } else if (email != "" && !patrones['email'].test(email)) {
        document.querySelector("#user_mail").style.border = "1px solid red";
        document.querySelector('.mail-alert').textContent = "That's not a valid email";
        document.querySelector('.mail-alert').style.display = "block";
        valid = false;
    } else {
        document.querySelector("#user_mail").style.border = "1px solid white";
        document.querySelector('.mail-alert').style.display = "none";
    }

    // Comprobación de fecha
    if (birthday != "" && !patrones['fecha'].test(birthday)) {
        document.querySelector("#user_birth").style.border = "1px solid red";
        document.querySelector('.birth-alert').textContent = "Date must be YYYY/mm/dd";
        document.querySelector('.birth-alert').style.display = "block";
        valid = false;
    } else {
        document.querySelector("#user_birth").style.border = "1px solid white";
        document.querySelector('.birth-alert').style.display = "none";
    }

    // Comprobación del tipo de cuenta
    if (isProfessional && type == "") {
        document.querySelector("#about").style.border = "1px solid red";
        document.querySelector('.about-alert').style.display = "none";
        valid = false;
    } else {
        document.querySelector("#about").style.border = "1px solid white";
        document.querySelector('.about-alert').style.display = "none";
    }

    // Comprobación de la contraseña
    if (pass == "") {
        document.querySelector("#user_pass").style.border = "1px solid red";
        document.querySelector('.password-alert').textContent = "Password is required";
        document.querySelector('.password-alert').style.display = "block";
        valid = false;
    } else if (pass.length < 6) {
        document.querySelector("#user_pass").style.border = "1px solid red";
        document.querySelector('.password-alert').textContent = "Password must be at least 6 characters long";
        document.querySelector('.password-alert').style.display = "block";
        valid = false;
    } else if (!!patrones['pass'].test(pass)) {
        document.querySelector("#user_pass").style.border = "1px solid red";
        document.querySelector('.password-alert').textContent = "Password must contain special characters and caps";
        document.querySelector('.password-alert').style.display = "block";
        valid = false;
    } else {
        document.querySelector("#user_pass").style.border = "1px solid white";
        document.querySelector('.password-alert').style.display = "none";
    }

    // Comprobación de la repetición de la contraseña
    if (pass != "" && repeat_pass != "") {
        if (repeat_pass != pass) {
            document.querySelector("#pass_repeat").style.border = "1px solid red";
            document.querySelector('.r-password-alert').textContent = "Password don't match up";
            document.querySelector('.r-password-alert').style.display = "block";
            valid = false;
        } else {
            document.querySelector("#pass_repeat").style.border = "1px solid white";
            document.querySelector('.r-password-alert').style.display = "block";
        }
    }

    return valid;
}

// Crea un JSON con los valores obtenidos del formulario
function createUserJSON(username, name, email, birthday, pass, isProfessional, type) {
    return user = {
        "username": username,
        "name": name,
        "pass": pass,
        "email": email,
        "birthday": birthday,
        "followers": 0,
        "following": 0,
        "professional": isProfessional,
        "type": type,
    }
}