<?php
    require_once('../vendor/autoload.php');
    require_once('conexion.php');

    // Crea una nueva conexión
    $con = new Conexion();

    /* --------------------- GET --------------------- */
    // Obtener entradas
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        try {
            // Selecciona todas las entradas
            $sql = "SELECT * FROM entradas WHERE 1";

            // Comprueba si se le ha pasado el id por parámetro y lo añade a la consulta
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $sql .= " AND id = '$id'";
            }

            // Comprueba si se ha pasado el nombre de usuario por parámetro y lo añade a la consulta
            if (isset($_GET['username'])) {
                $username = $_GET['username'];
                $sql .= " AND username = '$username'";
            }

            $sql .= " ORDER BY date DESC";

            $result = $con->query($sql);

            // Obtener las entradas
            $entradas = $result->fetch_all(MYSQLI_ASSOC);
            header("HTTP/1.1 200 OK");
            echo json_encode($entradas);
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
        exit;
    }

    /* --------------------- POST --------------------- */
    // Subir entrada
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Obtiene toda la información de la entrada pasada en la cabecera de la petición
        $json = file_get_contents('php://input');

        // Comprueba si se ha obtenido un fichero
        if (isset($json)) {
            try {
                $entrada = json_decode($json);

                $fecha_actual = date('Y-m-s H:i:s');

                // Sentencia para insertar la entrada en la base de datos
                $sql = "INSERT INTO entradas (username, content, date) VALUES ('{$entrada->username}', '{$entrada->content}', '$fecha_actual')";

                echo $sql;
                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($entrada);
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
        } else {
            header("HTTP/1.1 404 Not Found");
        }
        exit;
    }
?>