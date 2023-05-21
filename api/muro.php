<?php
    require_once('../vendor/autoload.php');
    require_once('conexion.php');

    // Crea una nueva conexión
    $con = new Conexion();

    /* --------------------- GET --------------------- */
    // Obtener opiniones del muro
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        try {
            // Selecciona todas las entradas
            $sql = "SELECT * FROM muro WHERE 1";

            // Comprueba si se le ha pasado el id por parámetro y lo añade a la consulta
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $sql .= " AND id = '$id";
            }

            // Comprueba si se ha pasado el nombre de usuario por parámetro y lo añade a la consulta
            if (isset($_GET['user_post'])) {
                $user_post = $_GET['user_post'];
                $sql .= " AND user_post = '$user_post'";
            }
            if (isset($_GET['user_profile'])) {
                $user_profile = $_GET['user_profile'];
                $sql .= " AND user_profile = '$user_profile'";
            }

            $sql .= " ORDER BY date DESC";

            $result = $con->query($sql);

            // Obtener las opiniones
            $opiniones = $result->fetch_all(MYSQLI_ASSOC);
            header("HTTP/1.1 200 OK");
            echo json_encode($opiniones);
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
        exit;
    }

    /* --------------------- POST --------------------- */
    // Subir opinión al muro
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Obtiene toda la información de la opinión pasada en la cabecera de la petición
        $json = file_get_contents('php://input');

        // Comprueba si se ha obtenido un fichero
        if (isset($json)) {
            try {
                $opinion = json_decode($json);

                $fecha_actual = date("Y-m-d H:i:s");

                // Sentencia para insertar la opinión en la base de datos
                $sql = "INSERT INTO muro (user_post, user_profile, content, date) VALUES ('{$opinion->user_post}', '{$opinion->user_profile}', '{$opinion->content}', '$fecha_actual')";

                echo $sql;
                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($opinion);
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
        } else {
            header("HTTP/1.1 404 Not Found");
        }
        exit;
    }
?>