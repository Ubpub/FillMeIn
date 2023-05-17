let username = document.querySelector('.username').textContent.replace('@', '');
let entradas = document.querySelector('.filter-entry');

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
    getUserEntries(username);
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
            entradas.append(entry);
        } else {
            console.log("ERROR");
        }
    })
}
