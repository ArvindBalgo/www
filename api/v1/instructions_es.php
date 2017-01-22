<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */


class instructions_es {
    //**** Variables declarations ****
    private $_id = 0;
    private $_instruction = null;

    private $_active = null;

   private static $SELECT="SELECT * FROM instructions_es";
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

    public function setInstruction($text) {
        $this->_instruction= $text;
    }
    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getInstruction() {
        return $this->_instruction;
    }

    public function deleteId($id) {
        $requete = "DELETE FROM instructions_es WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        if ($this->_id > 0) {
            $requete = "UPDATE instructions_es set instruction='".$this->_instruction."' WHERE id=".$this->_id;
        }
        else{
            $requete = "INSERT INTO instructions_es (";
            $requete .= "instruction";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_instruction . "')";
        }


        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $instructions = new instructions_es();
        $instructions->_id = $rs["id"];
        $instructions->_instruction = $rs["instruction"];;
        return $instructions;
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
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
} 