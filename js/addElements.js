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
        header = "../views/included-views/headerlog.html";
    } else {
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
        });
}