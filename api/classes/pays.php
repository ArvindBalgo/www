<?php

class pays {
    //**** Variables declarations ****
    private $_id = null;
    private $_libelle = "";
    private $_abrev = "";

   private static $SELECT="SELECT * FROM pays";
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

    public function setLibelle($lib) {
        $this->_libelle= $lib;
    }

    public function setAbrev($lang) {
        $this->_abrev= $lang;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getLibelle() {
        return $this->_libelle;
    }

    public function getAbrev() {
        return $this->_abrev;
    }
    
    public function delete($id) {
        $requete = "DELETE FROM pays WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE pays SET libelle='" . ($this->_libelle) . "'";
            $requete .= ", abrev='".($this->_abrev)."'"; 
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO pays (";
            $requete .= "libelle";
            $requete .= ",abrev";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_libelle . "',";
            $requete .= "'" . $this->_abrev . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $pays = new pays();
        $pays->_id = $rs["id"];
        $pays->_libelle = (($rs["description"]));
        $pays->_abrev = $rs["abrev"];
        return $pays;
    }

    public function rechercher() { // Recherche de toutes les pays
        $listLOG =	 array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = (($row));
        }

        return $rows;
    }

    public function findByPrimaryKey($key) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
} 