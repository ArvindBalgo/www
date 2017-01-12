<?php

class souscategory_prix {
    //**** Variables declarations ****
    private $_id = null;
    private $_id_modelmetier_category = 0;
    private $_id_coeff_prix = 0;
    private $_id_support = 0;

   private static $SELECT="SELECT * FROM souscategory_prix";
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

    public function setIdModelMetierCategory($id) {
        $this->_id_modelmetier_category= $id;
    }

    public function setidCoeffPrix($id) {
        $this->_id_coeff_prix= $id;
    }

    public function setSupport($id) {
        $this->_id_support= $id;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getIdModelMetierCategory() {
        return $this->_id_modelmetier_category;
    }

    public function getIdCoeffPrix() {
        return $this->_id_coeff_prix;
    }

    public function getIdSupport() {
        return $this->_id_support;
    }

    public function delete($id) {
        $requete = "DELETE FROM souscategory_prix WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE souscategory_prix SET id_modelmetier_category=" . ($this->_id_modelmetier_category) . "";
            $requete .= " , id_coeff_prix=" . $this->_id_coeff_prix;
            $requete .= " , id_support=" . $this->_id_support;
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO souscategory_prix (";
            $requete .= "id_modelmetier_category";
            $requete .= ",id_coeff_prix";
            $requete .= ",id_support";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_modelmetier_category . "',";
            $requete .= "'" . $this->_id_coeff_prix . "',";
            $requete .= "'" . $this->_id_support . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        if(!$rs){
            return "false";
        }
        $sous_prix = new souscategory_prix();
        $sous_prix->_id = $rs["id"];
        $sous_prix->_id_modelmetier_category = $rs["id_modelmetier_category"];
        $sous_prix->_id_coeff_prix = $rs["id_coeff_prix"];
        $sous_prix->_id_support = $rs["id_support"];
        return $sous_prix;
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

    public function findByCategorySupport($idsouscat, $idSupport) {
        $requete = self::$SELECT . " WHERE id_modelmetier_category=".$idsouscat ." AND id_support=".$idSupport;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
} 