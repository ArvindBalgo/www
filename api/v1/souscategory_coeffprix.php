<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */

class souscategory_coeffprix {
    //**** Variables declarations ****
    private $_id = null;
    private $_nom = null;
    private $_souscategory = null;

    private static $SELECT="SELECT * FROM souscategory_coeffprix";
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

    public function setSousCategory($sc) {
        $this->_souscategory= $sc;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getNom() {
        return $this->_nom;
    }

    public function getSousCategory() {
        return $this->_souscategory;
    }

    public function delete($id) {
        $requete = "DELETE FROM souscategory_coeffprix WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE souscategory_coeffprix SET nom='" . ($this->_nom) . "'";
            $requete .= ",souscategory=". ($this->_souscategory);
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO souscategory_coeffprix (";
            $requete .= "nom";
            $requete .= ",souscategory";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_nom . "',";
            $requete .= "" . $this->_souscategory . ")";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $souscategory_coeffprix = new souscategory_coeffprix();
        $souscategory_coeffprix->_id = $rs["id"];
        $souscategory_coeffprix->_nom = $rs["nom"];;
        $souscategory_coeffprix->_souscategory = $rs["souscategory"];;
        return $souscategory_coeffprix;
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

    public function findBySousCategory($id) {
        $requete = self::$SELECT . " where souscategory=".intval($id);
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function rechBySousCate1($id) {
        $listMetier  = array();
        $rs = $this->conn->query("SELECT id, nom as text FROM souscategory_coeffprix where souscategory=".intval($id));
        while($row = mysqli_fetch_array($rs)){
            $rows[] = $row;
        }
        return $rows;
    }
} 