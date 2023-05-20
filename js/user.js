let user = {};
let contenedor_entradas = document.querySelector('.filter-entry');

if (localStorage.getItem('webToken') != null) {
    document.title = `FillMeIn - ${ localStorage.getItem('username') }`
    loadElement()
} else {
    window.location.href = "login.html";
}

function loadElement() {
    document.querySelector('.back').innerHTML = 
    `<a href="home.html"><i class="bi bi-arrow-left"></i>&nbsp;&nbsp;&nbsp;${ localStorage.getItem('username') }</a>`
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

    let filtros = document.querySelectorAll('.filter-element');
    Array.from(filtros).forEach(item => {
        item.addEventListener('click', () => {
            Array.from(filtros).forEach(filtro => {
                filtro.classList.remove('selected');
            })
            item.classList.add('selected');
            if (item.textContent == "Entries") {
                document.querySelector('.filter-entry').style.display = "block";
                document.querySelector('.filter-wall').style.display = "none";
            } else {
                document.querySelector('.filter-entry').style.display = "none";
                document.querySelector('.filter-wall').style.display = "block";
            }
        })
    })

    getUserInfo();
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
                if (data[0]['professional'] == 1) {
                    document.querySelector('.professional-account').textContent = data[0]['type'];
                }

                // Comprobar seguidores y seguidos
                if (data['following'] != null && data[0]['following'].length > 0) {
                    document.querySelector('.following').textContent = `${ data[0]['following'].length }`;
                } else {
                    document.querySelector('.following').textContent = `0`;
                }
                if (data['followers'] != null && data[0]['followers'].length > 0) {
                    document.querySelector('.followers').textContent = `${ data[0]['followers'].length }`;
                } else {
                    document.querySelector('.followers').textContent = `0`;
                }

                getUserEntries(data[0]['username']);
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

async function getUserEntries(username) {
    const response = await fetch(`http://localhost/FillMeIn/api/entradas.php?username=${ username }`)
    .catch(error => console.error(error));
    console.log(response);
    const data = await response.json();

    data.forEach(item => {
        getEntries(item);
    })
}

function getEntries(entry_content) {
    // Busca el usuario que publicó la entrada para obtener sus datos
    const url = (`http://localhost/FillMeIn/api/usuario.php?username=${ entry_content.username }`);
    fetch( url )
    .then(response => {
        switch (response.status) {
            case 200:
                return response.json();
            case 404:
                console.log('Hubo un error')
            case 409:
                console.log('Hubo un error')
        }
    })
    .then( data => {
        if (data[0]) {
            let entry = document.createElement('div');
            entry.classList.add('entry-div');
            let image = '../imgs/Gray.png';
            if (data[0]['image'] != null) {
                image = data[0]['image'];
            }

            // Crea la entrada en la página
            entry.innerHTML = `
                <div class="user-image"><img src="${ image }" id="user-image-element" alt="User image" width="70" height="70"></div>
                <div class="entry-content">
                    <div class="entry-user">${ data[0]['name'] }</div>
                    <div class="entry-username">@${ data[0]['username'] }</div>
                    <div class="entry-text">${ entry_content.content }</div>
                </div>
            `;
            contenedor_entradas.append(entry);
        } else {
            console.log("ERROR");
        }
    })
}

function getUserInfo() {
    // Busca el usuario que publicó la entrada para obtener sus datos
    const url = (`http://localhost/FillMeIn/api/usuario.php?username=${ localStorage.getItem('username') }`);
    fetch( url )
    .then(response => {
        switch (response.status) {
            case 200:
                return response.json();
            case 404:
                console.log('Hubo un error')
            case 409:
                console.log('Hubo un error')
        }
    })
    .then( data => {
        if (data[0]) {
            let following = document.querySelector('.following');
            let followers = document.querySelector('.followers');

            if (data[0]['following'] != null && JSON.parse(data[0]['following']).length > 0) {
                following.textContent = `${ JSON.parse(data[0]['following']).length }`
            } else {
                following.textContent = "0";
            }

            if (data[0]['followers'] != null && JSON.parse(data[0]['followers']).length > 0) {
                followers.textContent = `${ JSON.parse(data[0]['followers']).length }`
            } else {
                followers.textContent = "0";
            }

            console.log(data[0]);
        } else {
            console.log("ERROR");
        }
    })
}
