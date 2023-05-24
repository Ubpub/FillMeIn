<?php
    require_once('../vendor/autoload.php');
    require_once('conexion.php');

    // Creación de una nueva conexión
    $con = new Conexion();

    /* ------------------- POST ------------------- */
    // Editar la contraseña de un usuario
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
                $newpass = hash("sha512", $user->newpass);

                // Comprueba si el usuario exite con la contraseña pasada
                $comprobacion = "SELECT * FROM usuarios WHERE username = '{$user->username}' AND pass = '$passHash'";
                $result = $con->query($comprobacion);

                // Se ejecuta si obtiene un usuario
                if ($result->num_rows == 1) {
                    // Sentencia para actualizar los campos editados del usuario
                    $sql = "UPDATE usuarios SET pass = '$newpass'
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
?>