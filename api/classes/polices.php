<?php

class polices {
    //**** Variables declarations ****
    private $_id = null;
    private $_nom = "";
    private $_path = "";
    private $_active = 1;

   private static $SELECT="SELECT * FROM polices";
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

    public function setNom($nom) {
        $this->_nom= $nom;
    }
    public function setPath($path) {
        $this->_path= $path;
    }
    public function setActive($active) {
        $this->_active= $active;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getNom() {
        return $this->_nom;
    }
    public function getPath() {
        return $this->_path;
    }
    public function getActive() {
        return $this->_active;
    }

    public function delete($id) {
        $requete = "DELETE FROM polices  WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE polices SET nom='" . ($this->_nom) . "'";
            $requete .= ", path='".$this->_path."'";
            $requete .= ", active=".$this->_active;
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO polices (";
            $requete .= "nom,";
            $requete .= "path,";
            $requete .= "active";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_nom . "',";
            $requete .= "'" . $this->_path . "',";
            $requete .= $this->_active . ")";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $polices = new polices();
        $polices->_id = $rs["id"];
        $polices->_nom = $rs["nom"];
        $polices->_path = $rs["path"];
        $polices->_active = $rs["active"];
        return $polices;
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

    public function rechercher1() { // Recherche de toutes les adresses
        $listLOG =	 array();
        $requete = "SELECT id, nom as name, path as url, active FROM `polices`";
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
} 