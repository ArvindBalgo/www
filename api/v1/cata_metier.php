<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */


class cata_metier {
    //**** Variables declarations ****
    private $_id_cata = null;
    private $_id_metier = null;
    private $_id_modelmetier = null;

    private $_active = null;

   private static $SELECT="SELECT * FROM cata_metier";
    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId_Cata($id_cata) {
        $this->_id_cata= $id_cata;
    }

    public function setId_Metier($id_metier) {
        $this->_id_metier= $id_metier;
    }

    public function setIdModelMetier($id) {
        $this->_id_modelmetier= $id;
    }

    public function setActive($active) {
        $this->_active = $active;
    }
    //**** Getters *****

    public function getId_Cata() {
        return $this->_id_cata;
    }

    public function getIdMetier() {
        return $this->_id_metier;
    }

    public function getIdModelMetier() {
        return $this->_id_modelmetier;
    }

    public function getActive() {
        return $this->_active;
    }

    public function deleteIdCata($id) {
        $requete = "DELETE FROM cata_metier WHERE id_cata=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
            $requete = "INSERT INTO cata_metier (";
            $requete .= "id_cata,";
            $requete .= "id_metier,";
            $requete .= "id_modelmetier,";
            $requete .= "active";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_cata . "',";
            $requete .= "'" . $this->_id_metier . "',";
            $requete .= "'" . $this->_id_modelmetier . "',";
            $requete .= "'" . $this->_active . "')";

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $cata_metier = new cata_metier();
        $cata_metier->_id_cata = $rs["id_cata"];
        $cata_metier->_id_metier = $rs["id_metier"];
        $cata_metier->_id_modelmetier = $rs["id_modelmetier"];
        $cata_metier->_active = $rs["active"];
        return $cata_metier;
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
        $requete = self::$SELECT . " WHERE id_cata=" . $key;
        $rs = $this->conn->query($requete);
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findByMetier($key){
        $requete = self::$SELECT . " WHERE id_metier=".$key;
        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function fnUpdateSubCat($id, $id_category){
        $requete = "UPDATE cata_metier set id_modelmetier=".$id_category . " where id_cata=".$id;
        $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return "done";
    }

    public function findByIdCata($id){
        $requete = self::$SELECT . " WHERE id_cata=".$id;
        $rs = $this->conn->query($requete);
        if (!$rs) {
            return null;
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
} 