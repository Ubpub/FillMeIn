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
            console.log(inputPass.type);
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
        // getValues(); Obtiene los valores del formulario
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

    let type = null;
    if (isProfessional == "YES") {
        type = document.querySelector("#about").value;
        isProfessional = 1;
    } else {
        type = null;
        isProfessional = 0;
    }

    createUserJSON(username, name, email, birthday, pass, isProfessional, type);
}

// Crea un JSON con los valores obtenidos del formulario
function createUserJSON(username, name, email, birthday, pass, isProfessional, type) {
    user = {
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

    console.log(user);
}