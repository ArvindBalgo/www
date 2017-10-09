<?php

class DbHandler
{

    private $conn;

    function __construct()
    {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    /**
     * Fetching single record
     */
    public function getOneRecord($query)
    {
        $r = $this->conn->query($query . ' LIMIT 1') or die($this->conn->error . __LINE__);
        return $result = $r->fetch_assoc();
    }

    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name)
    {

        $c = (array)$obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach ($column_names as $desired_key) { // Check the obj received. If blank insert blank into the array.
            if (!in_array($desired_key, $keys)) {
                $$desired_key = '';
            } else {
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns . $desired_key . ',';
            $values = $values . "'" . addslashes($$desired_key). "',";
        }

        $query = "INSERT INTO " . $table_name . "(" . trim($columns, ',') . ") VALUES(" . trim($values, ',') . ")";
        $r = $this->conn->query($query) or die($this->conn->error . __LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
        } else {
            return NULL;
        }
    }

    public function getSession()
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $sess = array();

        if (isset($_SESSION['uid'])) {
            $sess["uid"] = $_SESSION['uid'];
            $sess["name"] = $_SESSION['name'];
            $sess["email"] = $_SESSION['email'];
            $sess["admin"] = $_SESSION['admin'];
            $sess["admintype"] = $_SESSION['admintype'];
            $sess["type"] = $_SESSION['admintype'];
            $sess["pays"] = $_SESSION['pays'];
            $sess["city"] = $_SESSION['city'];
            $sess["surname"] = $_SESSION['surname'];
            $sess["tel"] = $_SESSION['tel'];
            $sess["address"] = $_SESSION['address'];
            $sess["postalcode"] = $_SESSION['postalcode'];
            $sess["token"] = $_SESSION['token'];
            $sess["salesman"] = $_SESSION['salesman'];
            $sess["min_val"] = $_SESSION['min_val'];
            $sess["max_val"] = $_SESSION['max_val'];
        } else {
            $sess["uid"] = '';
            $sess["name"] = 'Guest';
            $sess["email"] = '';
            $sess["admin"] = '0';
            $sess["admintype"] = '0';
            $sess["type"] = '0';
            $sess["pays"] = 'FR';
            $sess["city"] = '';
            $sess["surname"] = '';
            $sess["tel"] = '';
            $sess["address"] = '';
            $sess["postalcode"] = '';
            $sess["token"] = '';
            $sess["salesman"] = 0;
            $sess["min_val"] = 0;
            $sess["max_val"] = 0;
        }
        return $sess;
    }

    public function destroySession()
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        if (isSet($_SESSION['uid'])) {
            unset($_SESSION['uid']);
            unset($_SESSION['name']);
            unset($_SESSION['email']);
            unset($_SESSION['admin']);
            unset($_SESSION['admintype']);
            unset($_SESSION['pays']);
            unset($_SESSION['city']);
            unset($_SESSION['surname']);
            unset($_SESSION['tel']);
            unset($_SESSION['address']);
            unset($_SESSION['postalcode']);
            unset($_SESSION['token']);
            unset($_SESSION['salesman']);
            unset($_SESSION['min_val']);
            unset($_SESSION['max_val']);

            $info = 'info';
            if (isSet($_COOKIE[$info])) {
                setcookie($info, '', time() - $cookie_time);
            }
            $msg = "Logged Out Successfully...";
        } else {
            $msg = "Not logged in...";
        }
        return $msg;
    }
}