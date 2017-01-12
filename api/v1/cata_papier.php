<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */

class cata_papier {
    //**** Variables declarations ****
    private $_id = null;
    private $_description = null;

   private static $SELECT="SELECT * FROM cata_papier";
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

    public function setDescription($libelle) {
        $this->_description= $libelle;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getDescription() {
        return $this->_description;
    }

    public function delete($id) {
        $requete = "DELETE FROM cata_papier WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE cata_papier SET description='" . ($this->_description) . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO cata_papier (";
            $requete .= "description";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_description . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $cata_papier = new cata_papier();
        $cata_papier->_id = $rs["id"];
        $cata_papier->_description = $rs["description"];;
        return $cata_papier;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listLOG =	 array();
        $requete = "select id, description, false as chkval from cata_papier";
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = array();
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

    public function findByList($strList){
        $requete =  "select * from cata_papier where id in($strList)";
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByProduit($tarif) {
        $requete = "select c.* from cata_papier c inner join coeff_prix cp on (c.id = cp.id_support) where cp.id_souscategory_coeffprix=".$tarif;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }
} 