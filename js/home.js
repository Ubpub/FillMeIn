let contenedor_entradas = document.querySelector('.entry-container');

loadElement();

function loadElement() {
    document.querySelector('.upload').addEventListener('click', () => {
        let text_content = document.querySelector('#user-entry').value;
        if (text_content != "") {
            let entry = generateEntry(filterSymbols(text_content));
            createEntry(entry);
        }
    })
    fetchEntries();
}

async function fetchEntries() {
    const response = await fetch('http://localhost/FillMeIn/api/entradas.php')
    .catch(error => console.error(error));
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
            /* entry.innerHTML = `
                <div class="user-image"><img src="${ image }" id="user-image-element" alt="User image" width="70" height="70"></div>
                <div class="entry-content">
                    <div class="entry-user">${ data[0]['name'] }</div>
                    <div class="entry-username">@${ data[0]['username'] }</div>
                    <div class="entry-text">${ entry_content.content }</div>
                </div>
            `; */

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
                    data[0]['id'] == localStorage.getItem('id') && 
                    data[0]['username'] == localStorage.getItem('username'))
                {
                    window.location.href = 'user.html';
                } else {
                    window.location.href = `userprofile.php?id=${ data[0]['id'] }`;
                }
            })

            user_image.append(user_image_element);
            entry.append(user_image);

            // Contenido de la entrada
            let entry_content_div = document.createElement('div');
            entry_content_div.classList.add('entry-content');

            let entry_user = document.createElement('div');
            entry_user.classList.add('entry-user');
            entry_user.textContent = data[0]['name'];

            entry_user.addEventListener('click', () => {
                if (localStorage.getItem('webToken') != null &&
                    data[0]['id'] == localStorage.getItem('id') && 
                    data[0]['username'] == localStorage.getItem('username'))
                {
                    window.location.href = 'user.html';
                } else {
                    window.location.href = `userprofile.php?id=${ data[0]['id'] }`;
                }
            })

            entry_content_div.append(entry_user);

            let entry_username = document.createElement('div');
            entry_username.classList.add('entry-username');
            entry_username.textContent = `@${ data[0]['username'] }`;

            entry_username.addEventListener('click', () => {
                if (localStorage.getItem('webToken') != null &&
                    data[0]['id'] == localStorage.getItem('id') && 
                    data[0]['username'] == localStorage.getItem('username'))
                {
                    window.location.href = 'user.html';
                } else {
                    window.location.href = `userprofile.php?id=${ data[0]['id'] }`;
                }
            })

            entry_content_div.append(entry_username);

            let entry_text = document.createElement('div');
            entry_text.classList.add('entry-text');
            let contenido = defilterSymbols(entry_content.content);
            entry_text.textContent = contenido;

            entry_content_div.append(entry_text);

            entry.append(entry_content_div);

            contenedor_entradas.append(entry);
        } else {
            console.log("ERROR");
        }
    })
}

function createEntry(entry) {
    fetch('http://localhost/FillMeIn/api/entradas.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json,charset-utf-8'
            },
            body: JSON.stringify(entry)
        })
        .then((response) => {
            switch (response.status) {
                case 201:
                    window.location.href = "home.html";
                case 404:
                    console.log("No se ha podido subir");
            }
        });
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

function generateEntry(content) {
    return entry = {
        'username': localStorage.getItem('username'),
        'content': content,
    }
}
