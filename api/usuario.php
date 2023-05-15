<?php

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    require_once('../vendor/autoload.php');
    require_once('conexion.php');

    // Creación de una nueva conexión
    $con = new Conexion();

    // Creación de una clave que se utilizará para generar un webToken
    $key = 'example_key';

    /* ------------------- POST ------------------- */
    // Insertar un usuario 
    if($_SERVER['REQUEST_METHOD'] == 'POST') {

        // Obtener el fichero enviado en el cuerpo
        $json = file_get_contents('php://input');

        // Comprueba si se ha obtenido el fichero
        if (isset($json)) {
            try {
                //Almacenar el json en usuario
                $user = json_decode($json);

                // Cifrado de contraseña
                $passHash = hash("sha512", $user->pass);

                // Selecciona todos los usuarios que coincidan con el nombre de usuario pasado
                $sqlUsername = "SELECT * FROM usuarios WHERE username = '{$user->username}'";

                // Ejecuta la consulta
                $result = $con->query($sqlUsername);

                // El usuario se inserta si NO se ha encontrado ningún usuario con ese nombre
                if ($result->num_rows == 0) {
                
                    // Creación de sentencia sql para insertar nuevo usuario
                    $sql = "INSERT INTO usuarios (username, name, pass, email, birthday, followers, following,  professional, type)
                            VALUES ('{$user->username}', '{$user->name}', '$passHash', '{$user->email}',
                            '{$user->birthday}', '{$user->followers}', '{$user->following}', '{$user->professional}', '{$user->type}')";
                
                    $con->query($sql);
                    header("HTTP/1.1 201 Created");
                    echo json_encode($con->insert_id);
                } else {
                    header("HTTP/1.1 409 Conflict");
                }
            } catch (mysqli_sql_exception) {
                header("HTTP/1.1 400 Bad Request");
            }
        }
        exit;
    }

    /* ------------------- GET ------------------- */
    // Obtener los usuarios
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        try {
            $sql = "SELECT * FROM usuarios WHERE 1";

            // Comprobar si se ha enviado el id como parámetro
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $sql .= " AND id = '$id'";
            }
            if (isset($_GET['username']) && !isset($_GET['pass'])) {
                $username = $_GET['username'];
                $sql .= " AND username = '$username'";
            } else if (isset($_GET['username']) && isset($_GET['pass'])) {
                $username = $_GET['username'];
                $pass = $_GET['pass'];
                $hashPass = hash("sha512", $pass);
                $sql .= " AND username = '$username' AND pass = '$hashPass'";
            }

            $result = $con->query($sql);

            if ($result->num_rows > 0) {
                $users = $result->fetch_all(MYSQLI_ASSOC); // Obtiene lo usuarios

                // Genera un payload con el nombre de usuario (para el webToken)
                $payload = [
                    'iss' => $users[0]['username'],
                ];

                $jwt = JWT::encode($payload, $key, 'HS256');

                $users[0]['webToken'] = $jwt;

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
?>