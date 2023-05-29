const pass_patron = /^(?=.*)(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

if (localStorage.getItem('webToken') != null) {
    loadElements();
} else {
    window.location.href = 'home.html';
}

function loadElements() {

    // Cargar elementos y sus funciones
    let contenedor_cuenta = document.querySelector('.account-content');
    let contenedor_info = document.querySelector('.about-content');

    document.querySelector('.text-account').addEventListener('click', () => {
        contenedor_cuenta.classList.toggle('hidden');
    })
    document.querySelector('.text-about').addEventListener('click', () => {
        contenedor_info.classList.toggle('hidden');
    })

    document.querySelector('#save-pass-btn').addEventListener('click', changePass);
}

function changePass(e) {
    let mypass = document.querySelector('#current-password');
    let newpass = document.querySelector('#new-password');
    let repeatpass = document.querySelector('#repeat-password');
    let valid = checkValues(mypass, newpass, repeatpass);
    if (valid) {
        editPassword(userJSON(mypass, newpass));
    }
}

function editPassword(user) {
    let url = (`http://localhost/FillMeIn/api/password.php`);
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

function checkValues(cpass, npass, rpass) {
    let valid = true;
    if (cpass.value == "") {
        cpass.style.border = '1px solid red';
        valid = false;
    } else {
        cpass.style.border = '1px solid white';
    }

    if (npass.value == "") {
        npass.style.border = '1px solid red';
        valid = false;
    } else if (pass_patron.test(npass.value)) {
        npass.style.border = '1px solid red';
        valid = false;
    } else {
        npass.style.border = '1px solid white';
    }

    if (rpass.value == "") {
        rpass.style.border = '1px solid red';
        valid = false;
    } else if (rpass.value != npass.value) {
        rpass.style.border = '1px solid red';
    } else if (pass_patron.test(rpass.value)) {
        rpass.style.border = '1px solid red';
        valid = false;
    } else {
        rpass.style.border = '1px solid white';
    }

    return valid;
}

function userJSON(cpass, npass) {
    return {
        'username': localStorage.getItem('username'),
        'pass': cpass.value,
        'newpass': npass.value,
    }
}