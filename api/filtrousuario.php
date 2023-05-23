<?php

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    require_once('../vendor/autoload.php');
    require_once('conexion.php');

    // Creación de una nueva conexión
    $con = new Conexion();

    /* ------------------- GET ------------------- */
    // Obtener los usuarios
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        try {
            $sql = "SELECT * FROM usuarios WHERE 1";
            
            if (isset($_GET['username'])) {
                $username = $_GET['username'];
                $sql .= " AND (username LIKE '%$username%' OR type LIKE '%$username%')";
            }
            if (isset($_GET['professional'])) {
                $professional = $_GET['professional'];
                if ($professional == 'personal') {
                    $sql .= " AND professional = '0'";
                } else {
                    $sql .= " AND professional = '1'";
                }
            }

            // echo $sql;

            $result = $con->query($sql);

            if ($result->num_rows > 0) {
                $users = $result->fetch_all(MYSQLI_ASSOC); // Obtiene lo usuarios

                HEADER("HTTP/1.1 200 OK");
                echo json_encode($users);
            } else {
                header("HTTP/1.1 409 Conflict");
            }

        } catch(mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
        exit;
    }

    /* ------------------- POST ------------------- */
    // Actualizar seguidores y seguidos
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Obtener el fichero enviado en el cuerpo
        $json = file_get_contents('php://input');

        // Comprueba si se ha obtenido el fichero
        if (isset($json)) {
            try {
                // Almacenar el json en usuario
                $user = json_decode($json);

                // Comprueba si el usuario exite con la contraseña pasada
                $comprobacion = "SELECT * FROM usuarios WHERE username = '{$user->username}'";
                $result = $con->query($comprobacion);

                // Se ejecuta si obtiene un usuario
                if ($result->num_rows == 1) {
                    // Sentencia para actualizar los campos editados del usuario
                    $sql = "UPDATE usuarios SET username = '{$user->username}'";
                    if ($user->followers != null) {
                        $sql .= ", followers = '{$user->followers}'";
                    }
                    if ($user->following != null) {
                        $sql .= ", following = '{$user->following}'";
                    }
                    if ($user->saved_entries != null) {
                        $sql .= " , saved_entries = '{$user->saved_entries}'";
                    }
                    $sql .= " WHERE username = '{$user->username}'";

                    // Ejecución de la sentencia
                    $con->query($sql);

                    // Devuelve 201 si se ha creado correctamente
                    header("HTTP/1.1 201 Created");
                    echo json_encode($user);
                } else {
                    header("HTTP/1.1 409 Conflict");
                }
            } catch (mysqli_sql_exception $e) {
                // Devuelve un 400 en caso de que haya un problema con la petición
                header("HTTP/1.1 400 Bad Request");
            }
        }
        exit;
    }
?>