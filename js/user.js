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

    // Botón de editar perfil
    document.querySelector('#edit-bt').addEventListener('click', () => {
        window.location.href = 'edit.html';
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
                    if (data[0]['banner'] != null) {
                        document.querySelector('#banner').style.backgroundImage = `url('${ data[0]['banner'] }')`;
                    }
                    document.querySelector('.user-profile').textContent = `${ data[0]['name'] }`;
                    document.querySelector('.username').textContent = `@${ data[0]['username'] }`;
                    document.querySelector('.following').textContent = `${ data[0]['following'] }`;
                    document.querySelector('.followers').textContent = `${ data[0]['followers'] }`;
                } else {
                    // Si no hay información se muestra lo siguiente
                    document.querySelector('.user').textContent = `User`;
                    document.querySelector('.username').textContent = `-- Not Found --`;
                    document.querySelector('.following').textContent = `0`;
                    document.querySelector('.followers').textContent = `0`;
                }
            } else {
                console.log("ERROR");
            }
        })
}

