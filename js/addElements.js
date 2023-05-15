const header_view = checkLocalStorage();
let header_id = '.header';
const footer_view = "../views/included-views/footer.html";
let footer_id = '.footer';

getElements(header_view, header_id, true);
getElements(footer_view, footer_id, false);

// Comprueba con los items de localStorage si hay una sesión activa
function checkLocalStorage() {
    let header = "nulo";
    if (localStorage.getItem('webToken') != null) {
        // Si está logeado
        header = "../views/included-views/header-loged.html";
    } else {
        // Si no está logeado
        header = "../views/included-views/header.html";
    }
    return header;
}

function getElements(view, id, isHeader) {

    // Obtiene la vista de la cabecera / pie de página
    fetch(view)
        .then( (response) => response.text())
        .then(data => {
            document.querySelector(id).innerHTML = data;

            // Comprueba si es una cabecera o un footer
            if (isHeader) {
                if (localStorage.getItem('webToken') != null) {
                    if (localStorage.getItem('image') == 'Gray') document.querySelector('.user-img').src = '../imgs/Gray.png';
                    else {
                        document.querySelector('.user-img').src = `${ localStorage.getItem('image') }`;
                        // document.querySelector('.image-user-hd').style.borderRadius = "50%";
                    }
                    closeSession();
                }
            }
        });
}

function closeSession() {
    if (header_view == '../views/included-views/header-loged.html') {
        document.querySelector('.close-session').addEventListener('click', (e) => {
            localStorage.removeItem('username');
            localStorage.removeItem('webToken');
            localStorage.removeItem('id');
            localStorage.removeItem('image');
            window.location.href = 'login.html';
        });
    }
}