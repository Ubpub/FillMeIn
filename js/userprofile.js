let username = document.querySelector('.username').textContent.replace('@', '');
let entradas = document.querySelector('.filter-entry');
let opiniones = document.querySelector('.opinion-mural');

loadElement();

function loadElement() {
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

    let follow = document.querySelector('#follow-bt');
    follow.addEventListener('click', () => {
        if (!follow.classList.contains('unfollow')) {
            getUserInfo(username, true, false, false);
        } else {
            let remove = true;
            getUserInfo(username, true, false, remove);
        }
        follow.classList.toggle('unfollow');
    })

    if (localStorage.getItem('webToken') != null) {
        if (localStorage.getItem('image') != null) {
            document.querySelector('#user-image-element').src = localStorage.getItem('image');
        } else {
            document.querySelector('#user-image-element').src = '../imgs/Gray.png';
        }

        document.querySelector('.upload').addEventListener('click', () => {
            let contenido = document.querySelector('#user-opinion').value;
            if (contenido != null && contenido != "") {
                let opinion = generateOpinion(filterSymbols(contenido));
                uploadOpinion(opinion);
            }
        });
        getUserInfo(username, false, false, false);
    } else {
        document.querySelector('#follow-bt').style.display = 'none';
        document.querySelector('.add-entry').style.display = 'none';
    }
    getUserEntries(username);
    getUserOpinions(username);
}


async function getUserEntries(username) {
    const response = await fetch(`http://localhost/FillMeIn/api/entradas.php?username=${ username }`)
    .catch(error => console.error(error));
    const data = await response.json();

    data.forEach(item => {
        getEntries(item);
    })
}

async function getUserOpinions(username) {
    const response = await fetch(`http://localhost/FillMeIn/api/muro.php?user_profile=${ username }`)
    .catch(error => console.error(error));
    const data = await response.json();

    data.forEach(item => {
        getOpinions(item);
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
            entradas.append(entry);
        } else {
            console.log("ERROR");
        }
    })
}

function getUserInfo(username, add, isFollowed, remove) {
    // Busca el usuario que publicó la entrada para obtener sus datos
    const url = (`http://localhost/FillMeIn/api/usuario.php?username=${ username }`);
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

            if (!isFollowed) {
                getMyUserInfo(data[0]['id'], add, remove);
            } else {
                let followers = [];
                if (data[0]['followers'] != null && data[0]['followers'].length > 0) {
                    JSON.parse(data[0]['followers']).forEach(item => {
                        followers.push(item);
                    })
                }
                if (!remove) {
                    followers.push(localStorage.getItem('id'));
                } else {
                    followers = followers.filter(item => item != localStorage.getItem('id'));
                }

                let user_followed = {
                    'username': username,
                    'following': null,
                    'followers': JSON.stringify(followers),
                }

                // Actualiza los seguidos del usuario conectado
                fetch( `http://localhost/FillMeIn/api/filtrousuario.php`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json,charset-utf-8'
                    },
                    body: JSON.stringify(user_followed),
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
                    // console.log(data);
                    // window.location.href = `userprofile.php`;
                })
            }
        } else {
            console.log("ERROR");
        }
    })
}

function getMyUserInfo(user_follow, add, remove) {
    if (localStorage.getItem('webToken') != null) {
        // Busca el usuario que publicó la entrada para obtener sus datos
        const url = (`http://localhost/FillMeIn/api/usuario.php?id=${ localStorage.getItem('id') }&username=${ localStorage.getItem('username') }`);
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
            if (data[0] && add) {
                let following = [];
                if (data[0]['following'] != null && data[0]['following'].length > 0) {
                    JSON.parse(data[0]['following']).forEach(item => {
                        following.push(item);
                    })
                }
                if (!remove) {
                    following.push(user_follow);
                } else {
                    following = following.filter(item => item != user_follow);
                }

                let user = {
                    'username': localStorage.getItem('username'),
                    'following': JSON.stringify(following),
                    'followers': null,
                }

                // Actualiza los seguidos del usuario conectado
                fetch( `http://localhost/FillMeIn/api/filtrousuario.php`, {
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
                    console.log('TODO BIEN');
                })

                getUserInfo(username, true, true, remove);

            } else if (data[0] && !add) {
                let following = data[0]['following'];
                if (following != null) {
                    JSON.parse(following).forEach(item => {
                        if (item == user_follow) {
                            document.querySelector('#follow-bt').classList.add('unfollow');
                        }
                    })
                }
            }
        })
    }
}

function getOpinions(opinion_content) {
    // Busca el usuario que publicó la entrada para obtener sus datos
    const url = (`http://localhost/FillMeIn/api/usuario.php?username=${ opinion_content.user_post }`);
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
            let opinion_div = document.createElement('div');
            opinion_div.classList.add('entry-div');
            let image = '../imgs/Gray.png';
            if (data[0]['image'] != null) {
                image = data[0]['image'];
            }

            // Crea la entrada en la página
            opinion_div.innerHTML = `
                <div class="user-image"><img src="${ image }" id="user-image-element" alt="User image" width="70" height="70"></div>
                <div class="entry-content">
                    <div class="entry-user">${ data[0]['name'] }</div>
                    <div class="entry-username">@${ data[0]['username'] }</div>
                    <div class="entry-text">${ opinion_content.content }</div>
                </div>
            `;
            opiniones.append(opinion_div);
        } else {
            console.log("ERROR");
        }
    })
}

function uploadOpinion(opinion) {
    fetch('http://localhost/FillMeIn/api/muro.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json,charset-utf-8'
            },
            body: JSON.stringify(opinion)
        })
        .then((response) => {
            switch (response.status) {
                case 201:
                    window.location.href = window.location.href;
                case 404:
                    console.log("No se ha podido subir");
            }
        });
}

function generateOpinion(content) {
    return {
        'user_post': localStorage.getItem('username'),
        'user_profile': username,
        'content': content,
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
