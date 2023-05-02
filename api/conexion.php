<?php
    class Conexion extends mysqli {

        // Parámetros para la BD
        private $host = "localhost";
        private $db = "fillmein";
        private $user = "fillmein";
        private $pass = "H(-L3tk1w_tMqO.n";

        public function __construct() {
            try {
                parent::__construct($this->host, $this->user, $this->pass, $this->db);
            } catch(mysqli_sql_exception $e) {
                echo "ERROR: {e->getMessage()}";
                exit;
            }
        }
    }
?>