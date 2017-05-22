<?php

class temp_prod
{
    //**** Variables declarations ****
    private $_id = null;
    private $_session_id = "";
    private $_base64_image = "";
    private $_bonrepli = "";
    private $_commentaire = "";
    private $_dimension = "";
    private $_escargot = "";
    private $_idn_key = "";
    private $_idmodelmetier = 0;
    private $_idproduit = 0;
    private $_opt = "";
    private $_prix = 0;
    private $_unitprix = 0.00;
    private $_idsupport = 0;
    private $_support = "";
    private $_qte = "";
    private $_title = "";
    private $_data = "";
    private $_random_str = "";
    private $_escargot_val = "";
    private $_contours = "";
    private $_liserai = "";
    private $_id_dimension = "";
    private $_id_qte = "";

    private static $SELECT = "SELECT * FROM temp_prod";

    //**** Constructeur ****
    public function __construct()
    {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId($id)
    {
        $this->_id = $id;
    }

    public function setSessionId($id)
    {
        $this->_session_id = $id;
    }

    public function setbase64Image($data)
    {
        $this->_base64_image = $data;
    }

    public function setBonRepli($br)
    {
        $this->_bonrepli = $br;
    }
    public function setIdModelMetier($val)
    {
        $this->_idmodelmetier = $val;
    }
    public function setIdProduit($val)
    {
        $this->_idproduit = $val;
    }

    public function setCommentaire($comm)
    {
        $this->_commentaire = $comm;
    }

    public function setDimension($dim)
    {
        $this->_dimension = $dim;
    }

    public function setEscargot($escargot)
    {
        $this->_escargot = $escargot;
    }

    public function setIdnKey($id)
    {
        $this->_idn_key = $id;
    }

    public function setOpt($opt)
    {
        $this->_opt = $opt;
    }

    public function setPrix($prix)
    {
        $this->_prix = $prix;
    }

    public function setUnitPrix($prix)
    {
        $this->_unitprix = $prix;
    }

    public function setIdSupport($id)
    {
        $this->_idsupport = $id;
    }

    public function setSupport($support)
    {
        $this->_support = $support;
    }

    public function setQte($qte)
    {
        $this->_qte = $qte;
    }

    public function setTitle($title)
    {
        $this->_title = $title;
    }

    public function setData($data)
    {
        $this->_data = $data;
    }

    public function setRandomStr($str)
    {
        $this->_random_str = $str;
    }

    public function setEscargotVal($val)
    {
        $this->_escargot_val = $val;
    }

    public function setContours($val)
    {
        $this->_contours = $val;
    }

    public function setLiserai($val)
    {
        $this->_liserai = $val;
    }

    public function setIdDimension($val)
    {
        $this->_id_dimension = $val;
    }

    public function setIdQte($val)
    {
        $this->_id_qte = $val;
    }
    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getSessionId()
    {
        return $this->_session_id;
    }

    public function getbase64Image()
    {
        return $this->_base64_image;
    }

    public function getBonRepli()
    {
        return $this->_bonrepli;
    }

    public function getIdModelMetier()
    {
        return $this->_idmodelmetier;
    }

    public function getIdProduit()
    {
        return $this->_idproduit;
    }

    public function getCommentaire()
    {
        return $this->_commentaire;
    }

    public function getDimension()
    {
        return $this->_dimension;
    }

    public function getEscargot()
    {
        return $this->_escargot;
    }

    public function getIdnKey()
    {
        return $this->_idn_key;
    }

    public function getOpt()
    {
        return $this->_opt;
    }

    public function getPrix()
    {
        return $this->_prix;
    }

    public function getUnitPrix()
    {
        return $this->_unitprix;
    }

    public function getIdSupport()
    {
        return $this->_idsupport;
    }

    public function getSupport()
    {
        return $this->_support;
    }

    public function getQte()
    {
        return $this->_qte;
    }

    public function getTitle()
    {
        return $this->_title;
    }

    public function getData()
    {
        return $this->_data;
    }

    public function getRandomStr()
    {
        return $this->_random_str;
    }

    public function getEscargotVal()
    {
        return $this->_escargot_val;
    }

    public function getContours()
    {
        return $this->_contours;
    }

    public function getLiserai()
    {
        return $this->_liserai;
    }

    public function getIdDimension()
    {
        return $this->_id_dimension;
    }

    public function getIdQte()
    {
        return $this->_id_qte;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM temp_prod WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    public function deleteByKeyRandomStr($id, $randomStr)
    {
        $requete = "DELETE FROM temp_prod WHERE idn_key='" . $id."' and random_str='".$randomStr."'";
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save()
    {
        if ($this->_id > 0) {
            $requete = "UPDATE temp_prod SET session_id='" . ($this->_session_id) . "'";
            $requete .= ", base64_image='" . $this->_base64_image . "'";
            $requete .= ", bonrepli=" . $this->_bonrepli . "";
            $requete .= ", commentaire='" . $this->_commentaire . "'";
            $requete .= ", dimension='" . $this->_dimension . "'";
            $requete .= ", escargot=" . $this->_escargot . "";
            $requete .= ", idn_key='" . $this->_idn_key . "'";
            $requete .= ", idmodelmetier='" . $this->_idmodelmetier . "'";
            $requete .= ", idproduit='" . $this->_idproduit . "'";
            $requete .= ", opt=" . $this->_opt . "";
            $requete .= ", prix=" . $this->_prix . "";
            $requete .= ", unitprix=" . $this->_unitprix . "";
            $requete .= ", idsupport=" . $this->_idsupport . "";
            $requete .= ", support='" . $this->_support . "'";
            $requete .= ", qte=" . $this->_qte . "";
            $requete .= ", title='" . $this->_title . "'";
            $requete .= ", data='" . json_encode($this->_data) . "'";
            $requete .= ", random_str='" . json_encode($this->_random_str) . "'";
            $requete .= ", escargot_val='" . ($this->_escargot_val) . "'";
            $requete .= ", contours='" . ($this->_contours) . "'";
            $requete .= ", liserai='" . ($this->_liserai) . "'";
            $requete .= ", id_dimension='" . ($this->_id_dimension) . "'";
            $requete .= ", id_qte='" . ($this->_id_qte) . "'";
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
            $requete .= ",idmodelmetier";
            $requete .= ",idproduit";
            $requete .= ",opt";
            $requete .= ",prix";
            $requete .= ",unitprix";
            $requete .= ",idsupport";
            $requete .= ",support";
            $requete .= ",qte";
            $requete .= ",title";
            $requete .= ",data";
            $requete .= ",random_str";
            $requete .= ",escargot_val";
            $requete .= ",contours";
            $requete .= ",liserai";
            $requete .= ",id_dimension";
            $requete .= ",id_qte";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_session_id . "',";
            $requete .= "'" . $this->_base64_image . "',";
            $requete .= "'" . $this->_bonrepli . "',";
            $requete .= "'" . addslashes($this->_commentaire) . "',";
            $requete .= "'" . $this->_dimension . "',";
            $requete .= "'" . $this->_escargot . "',";
            $requete .= "'" . $this->_idn_key . "',";
            $requete .= "'" . $this->_idmodelmetier . "',";
            $requete .= "'" . $this->_idproduit. "',";
            $requete .= "'" . $this->_opt . "',";
            $requete .= "'" . $this->_prix . "',";
            $requete .= "'" . $this->_unitprix . "',";
            $requete .= "'" . $this->_idsupport . "',";
            $requete .= "'" . $this->_support . "',";
            $requete .= "'" . $this->_qte . "',";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . json_encode($this->_data) . "',";
            $requete .= "'" . $this->_random_str . "',";
            $requete .= "'" . $this->_escargot_val . "',";
            $requete .= "'" . $this->_contours. "',";
            $requete .= "'" . $this->_liserai . "',";
            $requete .= "'" . $this->_id_dimension . "',";
            $requete .= "'" . $this->_id_qte . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $temp_prod = new temp_prod();
        $temp_prod->_id = $rs["id"];
        $temp_prod->_session_id = $rs["session_id"];
        $temp_prod->_base64_image = $rs["base64_image"];
        $temp_prod->_bonrepli = $rs["bonrepli"];
        $temp_prod->_commentaire = $rs["commentaire"];
        $temp_prod->_dimension = $rs["dimension"];
        $temp_prod->_escargot = $rs["escargot"];
        $temp_prod->_idn_key = $rs["idn_key"];
        $temp_prod->_idmodelmetier = $rs["idmodelmetier"];
        $temp_prod->_idproduit = $rs["idproduit"];
        $temp_prod->_opt = $rs["opt"];
        $temp_prod->_prix = $rs["prix"];
        $temp_prod->_unitprix = $rs["unitprix"];
        $temp_prod->_idsupport = $rs["idsupport"];
        $temp_prod->_support = $rs["idsupport"];
        $temp_prod->_qte = $rs["qte"];
        $temp_prod->_title = $rs["title"];
        $temp_prod->_data = json_decode($rs["data"]);
        $temp_prod->_random_str = json_decode($rs["random_str"]);
        $temp_prod->_escargot_val = json_decode($rs["escargot_val"]);
        $temp_prod->_contours = json_decode($rs["contours"]);
        $temp_prod->_liserai = json_decode($rs["liserai"]);
        $temp_prod->_id_dimension = $rs["id_dimension"];
        $temp_prod->_id_qte = $rs["id_qte"];
        return $temp_prod;
    }

    public function rechercher()
    { // Recherche de toutes les adresses
        $listLOG = array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByPrimaryKey($key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findBySessionKey($id_session, $idn_key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE session_id='" . $id_session . "' and idn_key='" . $idn_key . "'";

        $rs = $this->conn->query($requete);

        if (!$rs) {
            return 'false';
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }


    public function findBySessionKey1($id_session, $idn_key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE session_id='" . $id_session . "' and idn_key='" . $idn_key . "'";

        $rs = $this->conn->query($requete);

        if (!$rs) {
            return 'false';
        }
        return mysqli_fetch_array($rs);
    }

    public function findBySession($id)
    {
        $requete = self::$SELECT . " WHERE session_id='" . $id . "'";
        $rs = $this->conn->query($requete);

        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function delBySessionKey($id)
    {
        $requete = "delete * from temp_prod where session_id='" . $id . "'";
        $rs = $this->conn->query($requete);
        return true;
    }

    public function findByComboKeyRandom($id, $random_str) {
        $requete = self::$SELECT . " WHERE random_str='" . $random_str . "' and idn_key='" . $id . "'";
        $rs = $this->conn->query($requete);

        if (!$rs) {
            return 'false';
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findByComboUserRandom($id, $random_str) {
        $requete = self::$SELECT . " WHERE random_str='" . $random_str . "' and idn_key='" . $id . "'";
        $rs = $this->conn->query($requete);

        if (!$rs) {
            return 'false';
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

} 