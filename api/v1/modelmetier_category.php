<?php
class modelmetier_category{

    //**** D�claration des variables ****
    private $_id            = null;
    private $_description   = "";
    private $_description_en   = "";
    private $_description_es   = "";
    private $_description_al   = "";
    private $_description_it   = "";
    private $_message       = "";
    private $_message_en       = "";
    private $_message_es       = "";
    private $_message_al       = "";
    private $_message_it       = "";
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


    public function setDescriptionEN($libelle) {
        $this->_description_en = $libelle;
    }

    public function setDescriptionES($libelle) {
        $this->_description_es = $libelle;
    }

    public function setDescriptionAL($libelle) {
        $this->_description_al = $libelle;
    }

    public function setDescriptionIT($libelle) {
        $this->_description_it = $libelle;
    }
    public function setMessage($msg) {
        $this->_message = $msg;
    }

    public function setMessageEn($msg) {
        $this->_message_en = $msg;
    }
    public function setMessageEs($msg) {
        $this->_message_es = $msg;
    }
    public function setMessageAl($msg) {
        $this->_message_al = $msg;
    }
    public function setMessageIt($msg) {
        $this->_message_it = $msg;
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

    public function getDescriptionEN() {
        return $this->_description_en;
    }
    public function getDescriptionES() {
        return $this->_description_es;
    }
    public function getDescriptionAL() {
        return $this->_description_al;
    }
    public function getDescriptionIT() {
        return $this->_description_it;
    }
    public function getMessage() {
        return $this->_message;
    }

    public function getMessageEn() {
        return $this->_message_en;
    }

    public function getMessageEs() {
        return $this->_message_es;
    }

    public function getMessageAl() {
        return $this->_message_al;
    }

    public function getMessageIt() {
        return $this->_message_it;
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
            $requete .= ",description_en='" . $this->_description_en . "'";
            $requete .= ",description_es='" . $this->_description_es . "'";
            $requete .= ",description_al='" . $this->_description_al . "'";
            $requete .= ",description_it='" . $this->_description_it . "'";
            $requete .= ",id_modelmetier='" . $this->_id_modelmetier . "'";
            $requete .= ",message='" . $this->_message . "'";
            $requete .= ",message_en='" . $this->_message_en . "'";
            $requete .= ",message_es='" . $this->_message_es . "'";
            $requete .= ",message_al='" . $this->_message_al . "'";
            $requete .= ",message_it='" . $this->_message_it . "'";
            $requete .= ",src='" . $this->_src."'";
            $requete .= ",qte='" . $this->_qte."'";
            $requete .= ",active=" . $this->_active;
            $requete .= " where id=" . $this->_id;

        } else {
            $requete = "INSERT INTO modelmetier_category (";
            $requete .= "description,";
            $requete .= "description_en,";
            $requete .= "description_es,";
            $requete .= "description_al,";
            $requete .= "description_it,";
            $requete .= "message,";
            $requete .= "message_en,";
            $requete .= "message_es,";
            $requete .= "message_al,";
            $requete .= "message_it,";
            $requete .= "id_modelmetier,";
            $requete .= "src,";
            $requete .= "qte,";
            $requete .= "active";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_description . "',";
            $requete .= "'" . $this->_description_en . "',";
            $requete .= "'" . $this->_description_es . "',";
            $requete .= "'" . $this->_description_al . "',";
            $requete .= "'" . $this->_description_it . "',";
            $requete .= "'" . $this->_message . "',";
            $requete .= "'" . $this->_message_en . "',";
            $requete .= "'" . $this->_message_es . "',";
            $requete .= "'" . $this->_message_al . "',";
            $requete .= "'" . $this->_message_it . "',";
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
        $metier->_description_en = $rs["description_en"];
        $metier->_description_es = $rs["description_es"];
        $metier->_description_al = $rs["description_al"];
        $metier->_description_it = $rs["description_it"];
        $metier->_message       = $rs["message"];
        $metier->_message_en    = $rs["message_en"];
        $metier->_message_es    = $rs["message_es"];
        $metier->_message_al    = $rs["message_al"];
        $metier->_message_it    = $rs["message_it"];
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