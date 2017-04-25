<?php
class listmetier{

    //**** D�claration des variables ****
    private $_id            = null;
    private $_libelle       = null;
    private $_sub_libelle   = null;
    private $_active        = null;
    private $_pays          = null;
    private $_key_libelle   = null;
    private $_key_sub_libelle   = null;
    private $_date_created  = null;
    private $_date_modified = null;

    private static $SELECT = "SELECT * FROM listmetier";

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

    public function setLibelle($libelle) {
        $this->_libelle = $libelle;
    }

    public function setSubLibelle($subLibelle) {
        $this->_sub_libelle = $subLibelle;
    }

    public function setActive($active) {
        $this->_active = $active;
    }

    public function setDateCreated($dateCreated) {
        $this->_date_created = $dateCreated;
    }

    public function setDateModified($dateModified) {
        $this->_date_modified = $dateModified;
    }

    public function setPays($pays) {
        $this->_pays = $pays;
    }

    public function setKeyLibelle($key) {
        $this->_key_libelle = $key;
    }

    public function setKeySubLibelle($key) {
        $this->_key_sub_libelle = $key;
    }
    //**** D�claration des getters ****
    public function getId() {
        return $this->_id;
    }

    public function getLibelle() {
        return $this->_libelle;
    }

    public function getSubLibelle() {
        return $this->_sub_libelle;
    }

    public function getActive() {
        return $this->_active;
    }

    public function getDateCreated() {
        return $this->_date_created;
    }

    public function getDateModified() {
        return $this->_date_modified;
    }

    public function getPays() {
        return $this->_pays;
    }

    public function getKeyLibelle() {
        return $this->_key_libelle;
    }

    public function getKeySubLibelle() {
        return $this->_key_sub_libelle;
    }

    //**** Fonction de suppression ****
    public function delete($id) {
        $requete = "DELETE FROM listmetier WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {
        $this->_date_modified = date('Y/m/d H:i:s', time());
       // if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
      //  }
        if ($this->_id > 0) {
            $requete = "UPDATE listmetier SET libelle='" . ($this->_libelle) . "'";
            $requete .= ",sub_libelle='" . $this->_sub_libelle . "'";
            $requete .= ",active=" . $this->_active;
            $requete .= ",pays=" . $this->_pays;
            $requete .= ",key_libelle='" . $this->_key_libelle. "'";
            $requete .= ",key_sub_libelle='" . $this->_key_sub_libelle. "'";
            $requete .= ",date_created='" . $this->_date_created . "'";
            $requete .= ",date_modified='" . $this->_date_modified . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO listmetier (";
            $requete .= "libelle,";
            $requete .= "sub_libelle,";
            $requete .= "active,";
            $requete .= "pays,";
            $requete .= "key_libelle,";
            $requete .= "key_sub_libelle,";
            $requete .= "date_created,";
            $requete .= "date_modified";
            $requete .= ") values (";
            $requete .= "'" . $this->_libelle . "',";
            $requete .= "'" . $this->_sub_libelle . "',";
            $requete .= $this->_active . ",";
            $requete .= $this->_pays . ",";
            $requete .= "'" . $this->_key_libelle . "',";
            $requete .= "'" . $this->_key_sub_libelle . "',";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_date_modified . "')";

        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $metier = new listmetier();
        $metier->setId($rs["id"]);
        $metier->_libelle = $rs["libelle"];
        $metier->_sub_libelle = $rs["sub_libelle"];
        $metier->_active = $rs["active"];
        $metier->_pays = $rs["pays"];
        $metier->_key_libelle = $rs["key_libelle"];
        $metier->_key_sub_libelle = $rs["key_sub_libelle"];
        $metier->_date_modified = $rs["date_modified"];
        $metier->_date_created = $rs["date_created"];
        return $metier;
    }

    public function rechercher() { // Recherche de toutes les adresses

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

    public function rechTous() {
        $listMetier  = array();
        $rs = $this->conn->query("SELECT id, concat(libelle ,' ', sub_libelle) as text FROM listmetier");
        $rows = [];
        while($row = mysqli_fetch_array($rs)){
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByPrimaryKey($key) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
}