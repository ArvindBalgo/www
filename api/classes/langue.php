<?php

class langue {
    //**** Variables declarations ****
    private $_id = null;
    private $_key_identifier = null;
    private $_english = "";
    private $_french = "";
    private $_spanish = "";
    private $_german = "";
    private $_italien = "";

   private static $SELECT="SELECT * FROM langue";
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

    public function setKeyIdentifier($key) {
        $this->_key_identifier= $key;
    }

    public function setEnglish($eng) {
        $this->_english= $eng;
    }

    public function setFrench($french) {
        $this->_french= $french;
    }

    public function setSpanish($spanish) {
        $this->_spanish= $spanish;
    }

    public function setGerman($german) {
        $this->_german= $german;
    }

    public function setItalien($italien) {
        $this->_italien= $italien;
    }


    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getKeyIdentifier() {
        return $this->_key_identifier;
    }

    public function getEnglish() {
        return $this->_english;
    }


    public function getFrench() {
        return $this->_french;
    }

    public function getSpanish() {
        return $this->_spanish;
    }

    public function getGerman() {
        return $this->_german;
    }

    public function getItalien() {
        return $this->_italien;
    }
    public function delete($id) {
        $requete = "DELETE FROM langue WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE langue SET key_identifier='" . ($this->_key_identifier) . "'";
            $requete .= ',english="' . $this->_english . '"';
            $requete .= ',french="' . $this->_french . '"';
            $requete .= ',spanish="' . $this->_spanish . '"';
            $requete .= ',german="' . $this->_german . '"';
            $requete .= ',italien="' . $this->_italien . '"';
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO langue (";
            $requete .= "key_identifier,";
            $requete .= "english,";
            $requete .= "french,";
            $requete .= "spanish,";
            $requete .= "german,";
            $requete .= "italien";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_key_identifier . "',";
            $requete .= '"' . $this->_english . '",';
            $requete .= '"' . $this->_french . '",';
            $requete .= '"' . $this->_spanish . '",';
            $requete .= '"' . $this->_german . '",';
            $requete .= '"' . $this->_italien . '")';
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $langue = new langue();
        $langue->_id = $rs["id"];
        $langue->_key_identifier = $rs["key_identifier"];
        $langue->_english = $rs["english"];
        $langue->_french = $rs["french"];
        $langue->_spanish = $rs["spanish"];
        $langue->_german = $rs["german"];
        $langue->_italien = $rs["italien"];
        return $langue;
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

    public function rechMultiKeys($lang) { // Recherche de toutes les adresses
        $listLOG =	 array();
        //$requete = self::$SELECT." where key_identifier IN('payment_direct', 'payment_varier_2fois', 'payment_fix_6fois')";
        $requete = self::$SELECT." where key_identifier IN('payment_fix_1fois', 'payment_fix_2fois','payment_fix_3fois','payment_fix_4fois','payment_fix_5fois','payment_fix_6fois')";
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            if($lang == 'EN') {
                $rows[$row["key_identifier"]] = $row["english"];
            }
            else if($lang == 'FR') {
                $rows[$row["key_identifier"]] = $row["french"];
            }
            else if($lang == 'ES') {
                $rows[$row["key_identifier"]] = $row["spanish"];
            }
            else if($lang == 'AL') {
                $rows[$row["key_identifier"]] = $row["german"];
            }
            else if($lang == 'IT') {
                $rows[$row["key_identifier"]] = $row["italien"];
            }
        }
        return $rows;
    }

    public function findByPrimaryKey($key) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findDoublon ($keyword){
        $requete = "select count(*) as count from langue where key_identifier = '".$keyword."'";
        $rs = $this->conn->query($requete);
        $result = mysqli_fetch_array($rs);
        return $result["count"];
    }

    public function rechByLang($lang) { // Recherche de toutes les adresses
        $listLOG =	 array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            if($lang == 'EN') {
                $rows[$row["key_identifier"]] = $row["english"];    
            }
            else if($lang == 'FR') {
                $rows[$row["key_identifier"]] = $row["french"];
            }
            else if($lang == 'ES') {
                $rows[$row["key_identifier"]] = $row["spanish"];
            }
            else if($lang == 'AL') {
                $rows[$row["key_identifier"]] = $row["german"];
            }
            else if($lang == 'IT') {
                $rows[$row["key_identifier"]] = $row["italien"];
            }
            
        }
        return $rows;
    }
} 