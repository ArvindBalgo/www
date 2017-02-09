<?php
class modelmetier_category{

    //**** D�claration des variables ****
    private $_id            = null;
    private $_description   = "";
    private $_key_description   = "";
    private $_message       = "";
    private $_key_message       = "";
    private $_id_modelmetier= null;
    private $_src           = null;
    private $_qte           = null;
    private $_active        = null;

    private static $SELECT = "SELECT * FROM modelmetier_category";

    //**** Constructeur ****
    private $conn;

    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** D�claration des setters *****
    public function setId($id) {
        $this->_id = $id;
    }

    public function setDescription($libelle) {
        $this->_description = $libelle;
    }


    public function setKeyDescription($key) {
        $this->_key_description = $key;
    }

    public function setMessage($msg) {
        $this->_message = $msg;
    }

    public function setKeyMessage($key) {
        $this->_key_message = $key;
    }

    public function setIdModelMetier($id) {
        $this->_id_modelmetier = $id;
    }

    public function setSrc($src) {
        $this->_src = $src;
    }

    public function setQte($qte){
        $this->_qte = $qte;
    }
    public function setActive($active){
        $this->_active = $active;
    }

    //**** D�claration des getters ****
    public function getId() {
        return $this->_id;
    }

    public function getDescription() {
        return $this->_description;
    }

    public function getKeyDescription() {
        return $this->_key_description;
    }

    public function getMessage() {
        return $this->_message;
    }

    public function getKeyMessage() {
        return $this->_key_message;
    }

    public function getIdModelMetier() {
        return $this->_id_modelmetier;
    }

    public function getSrc() {
        return $this->_src;
    }

    public function getQte() {
        return $this->_qte;
    }

    public function getActive() {
        return $this->_active;
    }
    //**** Fonction de suppression ****
    public function delete($id) {
        $requete = "DELETE FROM modelmetier_category WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {
        if ($this->_id > 0) {
            $requete = "update modelmetier_category set description='" . ($this->_description) . "'";
            $requete .= ",key_description='" . $this->_key_description . "'";
            $requete .= ",id_modelmetier='" . $this->_id_modelmetier . "'";
            $requete .= ",message='" . $this->_message . "'";
            $requete .= ",key_message='" . $this->_key_message . "'";
            $requete .= ",src='" . $this->_src."'";
            $requete .= ",qte='" . $this->_qte."'";
            $requete .= ",active=" . $this->_active;
            $requete .= " where id=" . $this->_id;

        } else {
            $requete = "INSERT INTO modelmetier_category (";
            $requete .= "description,";
            $requete .= "key_description,";
            $requete .= "message,";
            $requete .= "key_message,";
            $requete .= "id_modelmetier,";
            $requete .= "src,";
            $requete .= "qte,";
            $requete .= "active";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_description . "',";
            $requete .= "'" . $this->_key_description . "',";
            $requete .= "'" . $this->_message . "',";
            $requete .= "'" . $this->_key_message . "',";
            $requete .= "'" . $this->_id_modelmetier . "',";
            $requete .= "'" . $this->_src . "',";
            $requete .= "'" . $this->_qte . "',";
            $requete .= "'" . $this->_active . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $metier = new modelmetier_category();
        $metier->_id = $rs["id"];
        $metier->_description = $rs["description"];
        $metier->_key_description = $rs["key_description"];
        $metier->_message       = $rs["message"];
        $metier->_key_message       = $rs["key_message"];
        $metier->_id_modelmetier = $rs["id_modelmetier"];
        $metier->_qte = $rs["qte"];
        $metier->_src = $rs["src"];
        $metier->_active = $rs["active"];
        return $metier;
    }

    public function rechercher() { // Recherche de toutes

        $listMetier = array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function rechTous() { // Recherche de toutes

        $listMetier = array();
        $requete = "SELECT id, description as text, id_modelmetier, message from modelmetier_category";
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

    public function findByModel($id){
        $requete = self::$SELECT . " WHERE id_modelmetier=" . $id;
        $rs = $this->conn->query($requete);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function deleteByCategory($id) {
        $requete =  "DELETE from modelmetier_category where id_modelmetier=".$id;
        $rs = $this->conn->query($requete);

        return $rs;
    }
}