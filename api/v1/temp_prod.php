<?php

class temp_prod {
    //**** Variables declarations ****
    private $_id = null;
    private $_session_id = "";
    private $_base64_image = "";
    private $_bonrepli = "";
    private $_commentaire= "";
    private $_dimension = "";
    private $_escargot = "";
    private $_idn_key = "";
    private $_opt = "";
    private $_prix = "";
    private $_qte = "";
    private $_title = "";
    private $_data = "";

   private static $SELECT="SELECT * FROM temp_prod";
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

    public function setSessionId($id) {
        $this->_session_id= $id;
    }

    public function setbase64Image($data) {
        $this->_base64_image= $data;
    }

    public function setBonRepli($br) {
        $this->_bonrepli= $br;
    }
    
    public function setCommentaire($comm) {
        $this->_commentaire= $comm;
    }

    public function setDimension($dim) {
        $this->_dimension= $dim;
    }
    
    public function setEscargot($escargot) {
        $this->_escargot= $escargot;
    }
    
    public function setIdnKey($id) {
        $this->_idn_key= $id;
    }
    
    public function setOpt($opt) {
        $this->_opt= $opt;
    }
    
    public function setPrix($prix) {
        $this->_prix= $prix;
    }
    
    public function setQte($qte) {
        $this->_qte= $qte;
    }
    
    public function setTitle($title) {
        $this->_title = $title;
    }

    public function setData($data) {
        $this->_data = $data;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getSessionId($id) {
        return $this->_session_id;
    }

    public function getbase64Image($data) {
        return $this->_base64_image;
    }

    public function getBonRepli($br) {
        return $this->_bonrepli;
    }

    public function getCommentaire($comm) {
        return $this->_commentaire;
    }

    public function getDimension($dim) {
        return $this->_dimension;
    }

    public function getEscargot($escargot) {
        return $this->_escargot;
    }

    public function getIdnKey($id) {
        return $this->_idn_key;
    }

    public function getOpt($opt) {
        return $this->_opt;
    }

    public function getPrix($prix) {
        return $this->_prix;
    }

    public function getQte($qte) {
        return $this->_qte;
    }

    public function getTitle($title) {
        return $this->_title;
    }

    public function getData($data) {
        return $this->_data;
    }

    public function delete($id) {
        $requete = "DELETE FROM temp_prod WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE temp_prod SET session_id='" . ($this->_session_id) . "'";
            $requete .= ", base64_image='". $this->_base64_image ."'";
            $requete .= ", bonrepli=". $this->_bonrepli."";
            $requete .= ", commentaire='". $this->_commentaire."'";
            $requete .= ", dimension='". $this->_dimension."'";
            $requete .= ", escargot=". $this->_escargot."";
            $requete .= ", idn_key='". $this->_idn_key."'";
            $requete .= ", opt=". $this->_opt."";
            $requete .= ", prix=". $this->_prix."";
            $requete .= ", qte=". $this->_qte."";
            $requete .= ", title='". $this->_title."'";
            $requete .= ", data='". json_encode($this->_data)."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO temp_prod (";
            $requete .= "session_id";
            $requete .= ",base64_image";
            $requete .= ",bonrepli";
            $requete .= ",commentaire";
            $requete .= ",dimension";
            $requete .= ",escargot";
            $requete .= ",idn_key";
            $requete .= ",opt";
            $requete .= ",prix";
            $requete .= ",qte";
            $requete .= ",title";
            $requete .= ",data";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_session_id . "',";
            $requete .= "'" . $this->_base64_image. "',";
            $requete .= "'" . $this->_bonrepli . "',";
            $requete .= "'" . addslashes($this->_commentaire) . "',";
            $requete .= "'" . $this->_dimension . "',";
            $requete .= "'" . $this->_escargot . "',";
            $requete .= "'" . $this->_idn_key . "',";
            $requete .= "'" . $this->_opt . "',";
            $requete .= "'" . $this->_prix. "',";
            $requete .= "'" . $this->_qte. "',";
            $requete .= "'" . $this->_title. "',";
            $requete .= "'" . json_encode($this->_data). "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $temp_prod = new temp_prod();
        $temp_prod->_id             = $rs["id"];
        $temp_prod->_session_id     = $rs["session_id"];
        $temp_prod->_base64_image   = $rs["base64_image"];
        $temp_prod->_bonrepli       = $rs["bonrepli"];
        $temp_prod->_commentaire    = $rs["commentaire"];
        $temp_prod->_dimension      = $rs["dimension"];
        $temp_prod->_escargot       = $rs["escargot"];
        $temp_prod->_idn_key        = $rs["idn_key"];
        $temp_prod->opt             = $rs["opt"];
        $temp_prod->_prix           = $rs["prix"];
        $temp_prod->_qte            = $rs["qte"];
        $temp_prod->_title          = $rs["title"];
        $temp_prod->_data          = json_decode($rs["data"]);
        return $temp_prod;
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

    public function findBySessionKey($id_session, $idn_key) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE session_id=" . $id_session . " and idn_key='".$idn_key."'";
        $rs = $this->conn->query($requete);

        if(!$rs) {
            return 'false';
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findBySession($id) {
        $requete = self::$SELECT . " WHERE session_id='" . $id."'";
        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

} 