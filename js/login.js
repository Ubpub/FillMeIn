loadElement();

function loadElement() {
    // Mostrar u ocultar la contraseña
    let showPass = document.querySelector(".pass-icon");
    showPass.addEventListener('click', () => {
        if (showPass.classList.contains("bi-eye-slash")) {
            showPass.classList.remove("bi-eye-slash");
            showPass.classList.add("bi-eye");
        } else {
            showPass.classList.remove("bi-eye");
            showPass.classList.add("bi-eye-slash");
        }

        // Obtiene el input del icono
        let inputPass = null;
        if (showPass.getAttribute("data-icon")=="icon") {
            inputPass = document.querySelector("input[data-icon=icon]");
        }
        
        // Cambia el tipo del input
        if (inputPass.type == "password") {
            inputPass.type = "text";
        } else {
            inputPass.type = "password";
        }
    })

    // Evento onClick del botón Inicio de sesión
    let login_btn = document.querySelector('#login-bt');
    login_btn.addEventListener('click', login);
}



function login() {
    // Obtener los valores del formulario
    let username = document.querySelector('#user_name').value;
    let pass = document.querySelector('#user_pass').value;

    let valid = checkValues(username, pass);

    if (valid) {
        // Petición pasando el usuario y la contraseña
        const url = (`http://localhost/FillMeIn/api/usuario.php?username=${ username }&pass=${ pass }`);
        fetch( url )
            .then(response => {
                switch (response.status) {
                    case 200:
                        return response.json();
                    case 404:
                        document.querySelector('.alert').style.display = 'block';
                    case 409:
                        document.querySelector('.alert').style.display = 'block';
                }
            })
            .then( data => {
                if (data[0]) {
                    // Añade los datos a localStorage para mantener la sesión activa
                    localStorage.setItem('webToken', data[0].webToken);
                    localStorage.setItem('username', data[0].username);
                    localStorage.setItem('id', data[0].id);

                    // Comprueba si tiene una imagen
                    if(data[0].image != null) localStorage.setItem('image', data[0].image);
                    else localStorage.setItem('image', 'Gray');

                    window.location.href = 'home.html';
                } else {
                    console.log("ERROR");
                }
            })
    }
    
}

function checkValues(username, pass) {
    let valid = true;

    // Comprobación de nombre de usuario
    if (username == "") {
        document.querySelector("#user_name").style.border = "1px solid red";
        valid = false;
    } else {
        document.querySelector("#user_name").style.border = "1px solid white";
    }

    // Comprobación de la contraseña
    if (pass == "") {
        document.querySelector("#user_pass").style.border = "1px solid red";
        valid = false;
    } else {
        document.querySelector("#user_name").style.border = "1px solid white";
    }

    return valid;
}