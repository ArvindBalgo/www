<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */

/*
 * CREATE TABLE `commande_ligne` (
  `id` int(11) NOT NULL,
  `src` mediumtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `title` mediumtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
)
ALTER TABLE `commande_ligne`
  ADD PRIMARY KEY (`id`);

 * */

class commande_ligne {
    //**** Variables declarations ****
    private $_id = null;
    private $_title = null;
    private $_src = null;

   private static $SELECT="SELECT * FROM commande_ligne";
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

    public function setTitle($title) {
        $this->_title= $title;
    }
    public function setSrc($src) {
        $this->_src= $src;
    }


    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getSrc() {
        return $this->_src;
    }


    public function getTitle() {
        return $this->_title;
    }

    public function delete($id) {
        $requete = "DELETE FROM commande_ligne WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE commande_ligne SET title='" . ($this->_title) . "'";
            $requete .= ",src='" . $this->_src . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO commande_ligne (";
            $requete .= "title,";
            $requete .= "src";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . $this->_src . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $commande_ligne = new commande_ligne();
        $commande_ligne->_id = $rs["id"];
        $commande_ligne->_title = $rs["title"];
        $commande_ligne->_src = $rs["src"];
        return $commande_ligne;
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

        if($rs->num_rows === 0)
        {
            return null;
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function getLastId(){
        $requete = "SELECT MAX(id) AS id FROM commande_ligne";
        $rs = $this->conn->query($requete);
        $result = mysqli_fetch_array($rs);
        return $result["id"];
    }
} 