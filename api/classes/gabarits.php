<?php
class gabarits{

    //**** D�claration des variables ****
    private $_id            = null;
    private $_description   = null;
    private $_id_modelmetier= null;
    private $_src           = null;
    private $_type          = 0;
    private $_id_sample     = 0;
    private $_reference     = "";

    private static $SELECT = "SELECT * FROM gabarits";

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

    public function setIdModelMetier($id) {
        $this->_id_modelmetier = $id;
    }

    public function setSrc($src) {
        $this->_src = $src;
    }

    public function setType($type) {
        $this->_type = $type;
    }

    public function setIdSample($idSample) {
        $this->_id_sample = $idSample;
    }

    public function setReference($ref) {
        $this->_reference = $ref;
    }


    //**** D�claration des getters ****
    public function getId() {
        return $this->_id;
    }

    public function getDescription() {
        return $this->_description;
    }

    public function getIdModelMetier() {
        return $this->_id_modelmetier;
    }

    public function getSrc() {
        return $this->_src;
    }

    public function getType() {
        return $this->_type;
    }

    public function getIdSample() {
        return $this->_id_sample;
    }

    public function getReference() {
        return $this->_reference;
    }

    //**** Fonction de suppression ****
    public function delete($id) {
        $requete = "DELETE FROM gabarits WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {
        if ($this->_id > 0) {
            $requete = "update gabarits set description='" . ($this->_description) . "'";
            $requete .= ",id_modelmetier='" . $this->_id_modelmetier . "'";
            $requete .= ",src='" . $this->_src . "'";
            $requete .= ",type='" . $this->_type . "'";
            $requete .= ",id_sample='" . $this->_id_sample . "'";
            $requete .= ",reference='" . $this->_reference . "'";
            $requete .= " where id=" . $this->_id;

        } else {
            $requete = "insert into gabarits (";
            $requete .= "description,";
            $requete .= "id_modelmetier,";
            $requete .= "src,";
            $requete .= "type,";
            $requete .= "id_sample,";
            $requete .= "reference";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_description . "',";
            $requete .= "'" . $this->_id_modelmetier . "',";
            $requete .= "'" . $this->_src . "',";
            $requete .= "'" . $this->_type . "',";
            $requete .= "'" . $this->_id_sample . "',";
            $requete .= "'" . $this->_reference . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $requete;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $metier = new gabarits();
        $metier->_id = $rs->fields["id"];
        $metier->_description = $rs->fields["description"];
        $metier->_id_modelmetier = $rs->fields["id_modelmetier"];
        $metier->_src = $rs->fields["src"];
        $metier->_type = $rs->fields["type"];
        $metier->_id_sample = $rs->fields["id_sample"];
        $metier->_reference = $rs->fields["reference"];
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

    public function findByPrimaryKey($key) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }

    public function findByIdModel($id){
        $requete = self::$SELECT . " WHERE id_modelmetier = ".$id . " ORDER BY type";
        $resultat = $this->conn->query($requete);
        $rows = [];
        while($row = mysqli_fetch_array($resultat))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByType($type) {
        $requete = self::$SELECT . " WHERE type = ".$type ." ORDER BY type";
        $resultat = $this->conn->query($requete);
        $rows = [];
        while($row = mysqli_fetch_array($resultat))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findEmptyGabarits(){
        $requete = self::$SELECT . " WHERE id_sample = 0";
        $resultat = $this->conn->query($requete);
        $rows = [];
        while($row = mysqli_fetch_array($resultat)){
            $rows[] = $row;
        }
        return $rows;
    }
}