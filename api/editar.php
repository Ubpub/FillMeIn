<?php
    require_once('../vendor/autoload.php');
    require_once('conexion.php');

    // Creación de una nueva conexión
    $con = new Conexion();

    /* ------------------- POST ------------------- */
    // Editar un usuario
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Obtener el fichero enviado en el cuerpo
        $json = file_get_contents('php://input');

        // Comprueba si se ha obtenido el fichero
        if (isset($json)) {
            try {
                // Almacenar el json en usuario
                $user = json_decode($json);

                // Cifrado de contraseña
                $passHash = hash("sha512", $user->pass);

                // Comprueba si el usuario exite con la contraseña pasada
                $comprobacion = "SELECT * FROM usuarios WHERE username = '{$user->username}' AND pass = '$passHash'";
                $result = $con->query($comprobacion);

                // Se ejecuta si obtiene un usuario
                if ($result->num_rows == 1) {
                    // Sentencia para actualizar los campos editados del usuario
                    $sql = "UPDATE usuarios SET name = '{$user->name}', email = '{$user->email}',
                            birthday = '{$user->birthday}', biography = '{$user->biography}'
                            WHERE username = '{$user->username}' AND pass = '$passHash'";

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

    /* ------------------- DELETE ------------------- */
    // Eliminar el usuario
    if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        // Obtener el fichero enviado en el cuerpo
        $json = file_get_contents('pgp://input');

        // Comprueba si se ha obtenido el fichero
        if (isset($json)) {
            // Almacena el json en user
            $user = json_decode($json);

            // Cifrado de contraseña
            $hashPass = hash("sha512", $user->pass);

            // Sentencia para eliminar el usuario que coincida
            $sql = "DELETE FROM usuarios WHERE id = '{$user->id}' AND pass = '$hashPass'";
            try {
                $con->query($sql);
                header("HTTP/1.1 200 OK");
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
        }
        exit;
    }
?>