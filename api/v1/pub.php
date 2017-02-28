<?php

class pub {
    //**** Variables declarations ****
    private $_id = null;
    private $_actif = 0;
    private $_pays = "FR";
    private $_link = "";

   private static $SELECT="SELECT * FROM pub";
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

    public function setActif($actif) {
        $this->_actif= $actif;
    }

    public function setPays($pays) {
        $this->_pays= $pays;
    }


    public function setlink($link) {
        $this->_link= $link;
    }

    //**** Getters *****
    public function getId() {
        return $this->_id;
    }

    public function getActif() {
        return $this->_actif;
    }

    public function getPays() {
        return $this->_pays;
    }

    public function getLink() {
        return $this->_link;
    }

    public function delete($id) {
        $requete = "DELETE FROM pub WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE pub SET actif=" . ($this->_actif);
            $requete .= ", pays='".$this->_pays."'";
            $requete .= ", link='".$this->_link."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO pub (";
            $requete .= "actif,";
            $requete .= "pays";
            $requete .= "link";
            $requete .= ") VALUES (";
            $requete .= "" . $this->_actif . ",";
            $requete .= "'" . $this->_pays . "',";
            $requete .= "'" . $this->_link . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $pub = new pub();
        $pub->_id = $rs["id"];
        $pub->_actif= $rs["actif"];
        $pub->_pays= $rs["pays"];
        $pub->_link= $rs["link"];
        return $pub;
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