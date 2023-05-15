let contenedor_entradas = document.querySelector('.entry-container');

loadElement();

function loadElement() {
    document.querySelector('.upload').addEventListener('click', () => {
        let text_content = document.querySelector('#user-entry').value;
        if (text_content != "") {
            let entry = generateEntry(text_content);
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
    const url = (`http://localhost/FillMeIn/api/usuario.php?id=${ entry_content.user_id }`);
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

function generateEntry(content) {
    return entry = {
        'user_id': localStorage.getItem('id'),
        'content': content,
    }
}
