let user_container = document.querySelector('#user-container');

loadElement();

function loadElement() {
    let filters = document.querySelectorAll('.filter');
    Array.from(filters).forEach(item => {
        item.addEventListener('click', () => {
            Array.from(filters).forEach(filtro => {
                filtro.classList.remove('selected');
            })
            item.classList.add('selected');
            changeFilter();
        })
    })

    changeFilter();
}

// Cambia el filtro de la búsqueda de usuarios
function changeFilter() {
    user_container.innerHTML = ``;
    let filtro_usuario = document.querySelector('#search').value;
    let selected_filter = document.querySelector('.selected').textContent;
    if (selected_filter == 'All users') {
        getAllUsers(filtro_usuario);
    } else if (selected_filter == 'Personal account') {
        getFilterUsers(filtro_usuario, 'personal');
    } else if (selected_filter == 'Professional accounts') {
        getFilterUsers(filtro_usuario, 'profesional');
    }
    
}

function getAllUsers(username) {
    let error = 200;
    const url = (`http://localhost/FillMeIn/api/filtrousuario.php?username=${ username }`);
    fetch( url )
    .then(response => {
        switch (response.status) {
            case 200:
                return response.json();
            case 404:
                return error = 404;
            case 409:
                return error = 409;
        }
    })
    .then( data_user => {
        if (data_user.length > 0) {
            data_user.forEach(item => {
                createUserElement(item);
            })
        } else if (error == 404) {

        } else if(error == 409) {

        }
    })
}

function getFilterUsers(username, isProfessional=false) {
    let error = 200;
    let url = '';
    if (username == "") {
        url = (`http://localhost/FillMeIn/api/filtrousuario.php?professional=${ isProfessional }`);
    } else {
        url = (`http://localhost/FillMeIn/api/filtrousuario.php?username=${ username }&professional=${ isProfessional }`);
    }
    
    fetch( url )
    .then(response => {
        switch (response.status) {
            case 200:
                return response.json();
            case 404:
                return error = 404;
            case 409:
                return error = 409;
        }
    })
    .then( data_user => {
        if (data_user.length > 0) {
            data_user.forEach(item => {
                createUserElement(item);
            })
        } else if (error == 404) {

        } else if(error == 409) {

        }
    })
}

function createUserElement(data) {
    let user = document.createElement('div');
    user.classList.add('user-div');
    let image = '../imgs/Gray.png';
    if (data['image'] != null) {
        image = data['image'];
    }

    let user_image = document.createElement('div');
    user_image.classList.add('user-image');

    // Imagen del usuario
    let user_image_element = document.createElement('img');
    user_image_element.src = image;
    user_image_element.id = 'user-image-element';
    user_image_element.alt = 'User image';
    user_image_element.width = '70';
    user_image_element.height = '70';

    user_image_element.addEventListener('click', () => {
        if (localStorage.getItem('webToken') != null &&
            data['id'] == localStorage.getItem('id') && 
            data['username'] == localStorage.getItem('username'))
        {
            window.location.href = 'user.html';
        } else {
            window.location.href = `userprofile.php?id=${ data['id'] }`;
        }
    })

    user_image.append(user_image_element);
    user.append(user_image);

    // Contenido del usuario
    let user_content_div = document.createElement('div');
    user_content_div.classList.add('user-content');

    let user_name = document.createElement('div');
    user_name.classList.add('user-name');
    user_name.textContent = data['name'];

    user_name.addEventListener('click', () => {
        if (localStorage.getItem('webToken') != null &&
            data['id'] == localStorage.getItem('id') && 
            data['username'] == localStorage.getItem('username'))
        {
            window.location.href = 'user.html';
        } else {
            window.location.href = `userprofile.php?id=${ data['id'] }`;
        }
    })

    user_content_div.append(user_name);

    let user_username = document.createElement('div');
    user_username.classList.add('user-username');
    user_username.textContent = `@${ data['username'] }`;

    user_username.addEventListener('click', () => {
        if (localStorage.getItem('webToken') != null &&
            data['id'] == localStorage.getItem('id') && 
            data['username'] == localStorage.getItem('username'))
        {
            window.location.href = 'user.html';
        } else {
            window.location.href = `userprofile.php?id=${ data['id'] }`;
        }
    })

    user_content_div.append(user_username); // Lo añade al contenido del usuario

    if (data['biography'] != null && data['biograpy'] != "") {
        let user_biography = document.createElement('div');
        user_biography.classList.add('user-biography');
        let biography = defilterSymbols(data['biography']);
        user_biography.textContent = biography;

        user_content_div.append(user_biography); // Lo añade al contenido del usuario
    }

    if (data['professional'] == 1) {
        let type = document.createElement('div');
        type.classList.add('prof-type');
        let type_text = defilterSymbols(data['type']);
        type.textContent = type_text;

        user_content_div.append(type);
    }

    user.append(user_content_div);
    user_container.append(user);
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
