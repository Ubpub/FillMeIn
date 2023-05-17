<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
        // Obtener la URL del servidor
        $componentes = parse_url($_SERVER['REQUEST_URI']);

        // Obtener los parámetros pasados en la URL
        parse_str($componentes['query'], $results);

        // Almacenar en una variable la id obtenida de la URL
        $id = $results['id'];

        // Obtenemos los detalles con una petición a rutas.php pasando el id de ésta
        $userJSON = file_get_contents("http://localhost/FillMeIn/api/usuario.php?id=$id");

        // Pasamos el resultado obtenido a JSON
        $user = json_decode($userJSON);

        /* echo "<pre>";
        print_r($user[0]);
        echo "</pre>"; */
    ?>
    <title>FillMeIn - <?php echo $user[0]->username ?></title>

    <!-- Icono -->
    <link rel="icon" href="../imgs/icons/F.png">

    <!-- Iconos de Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <!-- Estilos -->
    <link rel="stylesheet" href="../css/userprofile.css">

</head>
<body>

    <!-- HEADER -->
    <div class="header"></div>

    <!-- CONTENIDO -->
    <div class="contenido">

        <div class="back"><a href="home.html"><i class="bi bi-arrow-left"></i>&nbsp;&nbsp;&nbsp;User</a></div>

        <!-- Div principal -->
        <div id="principal">

            <div class="p-element left-info">
                <div class="p-contenido">

                    <!-- Banner -->
                    <?php 
                        if ($user[0]->banner != null) {
                            $user_banner = $user[0]->banner;
                            ?>
                                <div id="banner" style="background-image:url('<?php echo $user_banner; ?>')">
                            <?php
                        } else {
                            echo "<div id='banner'>";
                        }
                    ?>
                        <?php
                            if ($user[0]->image != null) {
                                $image = $user[0]->image;
                                // echo "<div id='user-photo' style='background-image:url($image)'></div>";
                                ?>
                                    <div id="user-photo" style="background-image:url('<?php echo $image; ?>')"></div>;
                                <?php
                            } else {
                                echo "<div id='user-photo'></div>";
                            }
                        ?>
                    </div>
                    <!-- Fin banner -->

                    <!-- Botón de seguir usuario -->
                    <div class="follow-div">
                        <div id="follow-bt" class="follow"></div>
                    </div>
                    <!-- Fin de botón de seguir usuario -->

                    <!-- Información de usuario -->
                    <div class="user-info">
                        <div>
                            <div class="bold user-profile"><?php echo $user[0]->name ?></div>
                            <div class="small username">@<?php echo $user[0]->username ?></div>
                        </div>
                        <div class="follow-info">
                            <div class="bold">Following</div>
                            <div class="small following"><?php echo $user[0]->following ?></div>
                        </div>
                        <div class="follow-info">
                            <div class="bold">Followers</div>
                            <div class="small followers"><?php echo $user[0]->followers ?></div>
                        </div>
                    </div>
                    <!-- Fin de información de usuario -->

                    <!-- Entradas de usuario -->
                    <div class="entries-container">

                        <!-- Filtros de usuario -->
                        <div class="filters">
                            <div class="filter-element selected">Entries</div>
                            <div class="filter-element wall">Wall</div>
                            <div class="aux"></div>
                        </div>
                        <!-- Fin de filtros de usuario -->

                        <!-- Entradas y muro de usuario -->
                        <div class="entries">

                            <!-- Entradas -->
                            <div class="filter-entry">
                                
                            </div>
                            <!-- Fin entradas -->

                            <!-- Muro -->
                            <div class="filter-wall" style="display: none;">

                            </div>
                            <!-- Fin muro -->
                            
                        </div>
                        <!-- Fin entradas y muro de usuario -->

                    </div>
                    <!-- Fin de entradas de usuario -->

                </div>
            </div>

            <!-- Menú derecha -->
            <div class="p-element right-menu">
                <a href="home.html"><div><i class="bi bi-house-fill"></i>&nbsp;&nbsp;&nbsp;&nbsp;Home</div></a>
                <div><i class="bi bi-gear-fill"></i>&nbsp;&nbsp;&nbsp;&nbsp;Settings</div>
                <a href="home.html" class="profile-link"><div><i class="bi bi-person-fill"></i>&nbsp;&nbsp;&nbsp;&nbsp;Profile</div></a>
            </div>
            <!-- Fin menú derecha -->

        </div>
        <!-- Fin div principal -->

    </div>
    <!-- FIN CONTENIDO -->

    <!-- FOOTER -->
    <div class="footer"></div>

    <script src="../js/addElements.js"></script>
    <script src="../js/userprofile.js"></script>
    <script>
        let link = document.querySelector('.profile-link');
        if (localStorage.getItem('webToken') != null) {
            link.href = 'user.html';
        } else {
            link.href = 'login.html';
        }
    </script>
</body>
</html>