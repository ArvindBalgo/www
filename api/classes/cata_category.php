<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */

class cata_category {
    //**** Variables declarations ****
    private $_id = null;
    private $_libelle = null;
    private $_active = null;

   private static $SELECT="SELECT * FROM cata_category";
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

    public function setLibelle($libelle) {
        $this->_libelle= $libelle;
    }

    public function setActive($active) {
        $this->_active= $active;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getLibelle() {
        return $this->_libelle;
    }

    public function getActive() {
        return $this->_active;
    }

    public function delete($id) {
        $requete = "DELETE FROM cata_category WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE cata_category SET libelle='" . ($this->_libelle) . "'";
            $requete .= ",active=". ($this->_active);
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO cata_category (";
            $requete .= "libelle";
            $requete .= ",active";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_libelle . "',";
            $requete .= "" . $this->_active . ")";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $cata_category = new cata_category();
        $cata_category->_id = $rs["id"];
        $cata_category->_libelle = $rs["libelle"];;
        $cata_category->_active = $rs["active"];;
        return $cata_category;
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
} 