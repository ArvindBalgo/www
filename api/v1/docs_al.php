<?php

class docs_al {
    //**** Variables declarations ****
    private $_id = null;
    private $_cle = null;
    private $_title = "";
    private $_description = null;

   private static $SELECT="SELECT * FROM docs_al";
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

    public function setCle($clef) {
        $this->_cle= $clef;
    }

    public function setTitle($title) {
        $this->_title= $title;
    }
    public function setDescription($description) {
        $this->_description= $description;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getCle() {
        return $this->_cle;
    }

    public function getTitle() {
        return $this->_title;
    }


    public function getDescription() {
        return $this->_description;
    }

    public function delete($id) {
        $requete = "DELETE FROM docs_al WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE docs_al SET cle='" . ($this->_cle) . "'";
            $requete .= ",title='" . $this->_title . "'";
            $requete .= ",description='" . $this->_description . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO docs_al (";
            $requete .= "cle,";
            $requete .= "title,";
            $requete .= "description";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_cle . "',";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . $this->_description . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $document = new docs_al();
        $document->_id = $rs["id"];
        $document->_cle = $rs["cle"];
        $document->_title= $rs["title"];
        $document->_description = $rs["description"];
        return $document;
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

    public function findByCle($clef){
        $requete = self::$SELECT . " WHERE cle='" . $clef."'";
        $rs = $this->conn->query($requete);
        $this->mapSqlToObject(mysqli_fetch_array($rs));
        if(mysqli_fetch_array($rs) == null) {
            return false;
        }
        else{

            return (mysqli_fetch_array($rs));
        }

    }
} 