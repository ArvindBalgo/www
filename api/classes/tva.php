<?php

class tva {
    //**** Variables declarations ****
    private $_id = null;
    private $_value = "";
    private $_pays = "";

   private static $SELECT="SELECT * FROM tva";
    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId($id) {
        $this->_id= $id;
    }

    public function setValue($val) {
        $this->_value= $val;
    }

    public function setPays($val) {
        $this->_pays= $val;
    }


    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getValue() {
        return $this->_value;
    }

    public function getPays() {
        return $this->_pays;
    }

    public function delete($id) {
        $requete = "DELETE FROM tva WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE tva SET value='" . ($this->_value) . "'";
            $requete .= " , pays='".$this->_pays."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO tva (";
            $requete .= "value";
            $requete .= ",pays";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_value. "',";
            $requete .= "'" . $this->_pays. "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $tva = new tva();
        $tva->_id = $rs["id"];
        $tva->_value = $rs["value"];
        $tva->_pays = $rs["pays"];
        return $tva;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listLOG =	 array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByPrimaryKey($key) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findByPays($key) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE pays='" . $key."'";
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
} 