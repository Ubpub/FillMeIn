let contenedor_entradas = document.querySelector('.entry-container');
let contenedor_usuarios = document.querySelector('#user-container');
let filter_selected = document.querySelector('.selected');

let saved_entries_user = [];
if (localStorage.getItem('webToken') != null) {
    getActualUser(saved_entries_user);
}

loadElement();

function loadElement() {
    document.querySelector('.upload').addEventListener('click', () => {
        let text_content = document.querySelector('#user-entry').value;
        if (text_content != "") {
            let entry = generateEntry(filterSymbols(text_content));
            createEntry(entry);
        }
    })

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

async function fetchEntries() {
    let selected_filter = document.querySelector('.selected').textContent;
    if (selected_filter == "All users") {
        const response = await fetch('http://localhost/FillMeIn/api/entradas.php')
        .catch(error => console.error(error));
        const data = await response.json();
    
        data.forEach(item => {
            getEntries(item);
        })
    } else if (selected_filter == "Following") {
        getUser();
    }
}

async function getActualUser(saved_entries_user) {
    const response = await fetch(`http://localhost/FillMeIn/api/usuario.php?username=${ localStorage.getItem('username') }`)
    .catch(error => console.error(error));
    const data = await response.json();
    if (data[0]['saved_entries'] != null && data[0]['saved_entries'].length > 0) {
        JSON.parse(data[0]['saved_entries']).forEach(item => {
            saved_entries_user.push(item);
        })
    }
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

            let icon = document.createElement('div');
            icon.classList.add('icon');

            let icon_book = document.createElement('i');
            // icon_book.classList.add('bi', 'bi-bookmark');
            // icon_book.setAttribute('onclick', 'saveEntry(this)');
            icon_book.setAttribute('data-id', entry_content.id);
            if (saved_entries_user.includes(icon_book.getAttribute('data-id'))) {
                icon_book.classList.add('bi-bookmark-fill');
            } else {
                icon_book.classList.add('bi-bookmark');
            }

            icon_book.addEventListener('click', () => {
                if (icon_book.classList.contains('bi-bookmark-fill')) {
                    icon_book.classList.remove('bi-bookmark-fill');
                    icon_book.classList.add('bi-bookmark');
                } else if (icon_book.classList.contains('bi-bookmark')) {
                    icon_book.classList.remove('bi-bookmark');
                    icon_book.classList.add('bi-bookmark-fill');
                }
            })
            icon_book.onclick = (e) => {
                saveEntry(e, icon_book);
            }



            icon.append(icon_book);

            entry_content_div.append(icon);

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

function getUsers(username) {
    // Busca el usuario que publicó la entrada para obtener sus datos
    let error = 0;
    const url = (`http://localhost/FillMeIn/api/filtrousuario.php?username=${ username }`);
    fetch( url )
    .then(response => {
        switch (response.status) {
            case 200:
                return response.json();
            case 404:
                console.log('Hubo un error')
            case 409:
                return error = 409;
        }
    })
    .then( data => {
        if (error != 409){
            data.forEach(item => {
                if (item) {
                    let user = document.createElement('div');
                    user.classList.add('user-div');
                    let image = '../imgs/Gray.png';
                    if (item['image'] != null) {
                        image = item['image'];
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
                            item['id'] == localStorage.getItem('id') && 
                            item['username'] == localStorage.getItem('username'))
                        {
                            window.location.href = 'user.html';
                        } else {
                            window.location.href = `userprofile.php?id=${ item['id'] }`;
                        }
                    })
        
                    user_image.append(user_image_element);
                    user.append(user_image);
        
                    // Contenido del usuario
                    let user_content_div = document.createElement('div');
                    user_content_div.classList.add('user-content');
        
                    let user_name = document.createElement('div');
                    user_name.classList.add('user-name');
                    user_name.textContent = item['name'];
        
                    user_name.addEventListener('click', () => {
                        if (localStorage.getItem('webToken') != null &&
                            item['id'] == localStorage.getItem('id') && 
                            item['username'] == localStorage.getItem('username'))
                        {
                            window.location.href = 'user.html';
                        } else {
                            window.location.href = `userprofile.php?id=${ item['id'] }`;
                        }
                    })
        
                    user_content_div.append(user_name);
        
                    let user_username = document.createElement('div');
                    user_username.classList.add('user-username');
                    user_username.textContent = `@${ item['username'] }`;
        
                    user_username.addEventListener('click', () => {
                        if (localStorage.getItem('webToken') != null &&
                            item['id'] == localStorage.getItem('id') && 
                            item['username'] == localStorage.getItem('username'))
                        {
                            window.location.href = 'user.html';
                        } else {
                            window.location.href = `userprofile.php?id=${ item['id'] }`;
                        }
                    })
        
                    user_content_div.append(user_username);
        
                    if (item['biography'] != null && item['biograpy'] != "") {
                        let user_biography = document.createElement('div');
                        user_biography.classList.add('user-biography');
                        let biography = defilterSymbols(item['biography']);
                        user_biography.textContent = biography;
            
                        user_content_div.append(user_biography);
                    }

                    if (item['professional'] == 1) {
                        let type = document.createElement('div');
                        type.classList.add('prof-type');
                        let type_text = defilterSymbols(item['type']);
                        type.textContent = type_text;

                        user_content_div.append(type);
                    }
        
                    user.append(user_content_div);
        
                    contenedor_usuarios.append(user);
                } else {
                    console.log("ERROR");
                }
            })
        } else if (error == 409) {
            contenedor_usuarios.innerHTML = `<div class="no-users">Nothing was found...</div>`;
        }
    })
}

function changeFilter() {
    let filtro_usuario = document.querySelector('#search').value;
    if (filtro_usuario == "" || filtro_usuario == null) {
        contenedor_entradas.classList.remove('hidden');
        contenedor_usuarios.classList.add('hidden');
        contenedor_entradas.innerHTML = ``;
        fetchEntries();
    } else {
        contenedor_entradas.classList.add('hidden');
        contenedor_usuarios.classList.remove('hidden');
        contenedor_usuarios.innerHTML = ``;
        getUsers(filtro_usuario);
    }
}

function getUser() {
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
                return error = 409;
        }
    })
    .then( data_user => {
        if (data_user[0]) {

            // Obtiene las entradas
            fetch( 'http://localhost/FillMeIn/api/entradas.php' )
            .then(response => {
                switch (response.status) {
                    case 200:
                        return response.json();
                    case 404:
                        console.log('Hubo un error')
                    case 409:
                        return error = 409;
                }
            })
            .then( data_entry => {
                if (data_entry) {

                    data_entry.forEach(data_entry_item => {

                        // Obtiene el usuario de la entrada
                        fetch( `http://localhost/FillMeIn/api/usuario.php?username=${ data_entry_item['username'] }` )
                        .then(response => {
                            switch (response.status) {
                                case 200:
                                    return response.json();
                                case 404:
                                    console.log('Hubo un error')
                                case 409:
                                    return error = 409;
                            }
                        })
                        .then( data_user_found => {
                            if (data_user_found[0]) {

                                JSON.parse(data_user[0]['following']).forEach(item => {
                                    if (item == data_user_found[0]['id']) {

                                        // Imprime la entrada con sus valores
                                        let entry = document.createElement('div');
                                        entry.classList.add('entry-div');
                                        let image = '../imgs/Gray.png';
                                        if (data_user_found[0]['image'] != null) {
                                            image = data_user_found[0]['image'];
                                        }

                                        // Crea la entrada en la página
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
                                                data_user_found[0]['id'] == localStorage.getItem('id') && 
                                                data_user_found[0]['username'] == localStorage.getItem('username'))
                                            {
                                                window.location.href = 'user.html';
                                            } else {
                                                window.location.href = `userprofile.php?id=${ data_user_found[0]['id'] }`;
                                            }
                                        })

                                        user_image.append(user_image_element);
                                        entry.append(user_image);

                                        // Contenido de la entrada
                                        let entry_content_div = document.createElement('div');
                                        entry_content_div.classList.add('entry-content');

                                        let entry_user = document.createElement('div');
                                        entry_user.classList.add('entry-user');
                                        entry_user.textContent = data_user_found[0]['name'];

                                        entry_user.addEventListener('click', () => {
                                            if (localStorage.getItem('webToken') != null &&
                                                data_user_found[0]['id'] == localStorage.getItem('id') && 
                                                data_user_found[0]['username'] == localStorage.getItem('username'))
                                            {
                                                window.location.href = 'user.html';
                                            } else {
                                                window.location.href = `userprofile.php?id=${ data_user_found[0]['id'] }`;
                                            }
                                        })

                                        entry_content_div.append(entry_user);

                                        let entry_username = document.createElement('div');
                                        entry_username.classList.add('entry-username');
                                        entry_username.textContent = `@${ data_user_found[0]['username'] }`;

                                        entry_username.addEventListener('click', () => {
                                            if (localStorage.getItem('webToken') != null &&
                                                data_user_found[0]['id'] == localStorage.getItem('id') && 
                                                data_user_found[0]['username'] == localStorage.getItem('username'))
                                            {
                                                window.location.href = 'user.html';
                                            } else {
                                                window.location.href = `userprofile.php?id=${ data_user_found[0]['id'] }`;
                                            }
                                        })

                                        entry_content_div.append(entry_username);

                                        let entry_text = document.createElement('div');
                                        entry_text.classList.add('entry-text');
                                        let contenido = defilterSymbols(data_entry_item.content);
                                        entry_text.textContent = contenido;

                                        entry_content_div.append(entry_text);

                                        let icon = document.createElement('div');
                                        icon.classList.add('icon');

                                        let icon_book = document.createElement('i');
                                        icon_book.classList.add('bi', 'bi-bookmark');
                                        icon_book.setAttribute('data-id', data_entry_item.id);

                                        icon_book.addEventListener('click', () => {
                                            if (icon_book.classList.contains('bi-bookmark-fill')) {
                                                icon_book.classList.remove('bi-bookmark-fill');
                                                icon_book.classList.add('bi-bookmark');
                                            } else if (icon_book.classList.contains('bi-bookmark')) {
                                                icon_book.classList.remove('bi-bookmark');
                                                icon_book.classList.add('bi-bookmark-fill');
                                            }
                                        })

                                        icon.append(icon_book);

                                        entry_content_div.append(icon);

                                        entry.append(entry_content_div);

                                        contenedor_entradas.append(entry);
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }
    })
}

// Guardar una entrada
function saveEntry(e, icon) {
    if (localStorage.getItem('webToken') != null) {
        
        // Busca el usuario que tiene la sesión iniciada
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
                let isSaved = false;
                if (icon.classList.contains('bi-bookmark-fill')) {
                    isSaved = true;
                }
                let saved_entries = [];
                if (data[0]['saved_entries'] != null && data[0]['saved_entries'].length > 0) {
                    JSON.parse(data[0]['saved_entries']).forEach(item => {
                        saved_entries.push(item);
                    })
                }
                if (isSaved) {
                    saved_entries.push(e.target.getAttribute('data-id'));
                } else {
                    saved_entries = saved_entries.filter(item => item != e.target.getAttribute('data-id'));
                }

                console.log(saved_entries);

                let saved_entry = {
                    'username': localStorage.getItem('username'),
                    'following': null,
                    'followers': null,
                    'saved_entries': JSON.stringify(saved_entries),
                }

                console.log(saved_entry);

                // Actualiza los seguidos del usuario conectado
                fetch( `http://localhost/FillMeIn/api/filtrousuario.php`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json,charset-utf-8'
                    },
                    body: JSON.stringify(saved_entry),
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
            }
        })
    }
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
