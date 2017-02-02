<?php
class listmetier{

    //**** D�claration des variables ****
    private $_id            = null;
    private $_libelle       = null;
    private $_libelle_en    = null;
    private $_libelle_al     = null;
    private $_libelle_it     = null;
    private $_libelle_es     = null;
    private $_sub_libelle   = null;
    private $_sub_libelle_en = null;
    private $_sub_libelle_es = null;
    private $_sub_libelle_it = null;
    private $_sub_libelle_al = null;
    private $_active        = null;
    private $_pays          = null;
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

    public function setLibelleEn($libelle) {
        $this->_libelle_en = $libelle;
    }

    public function setLibelleES($libelle) {
        $this->_libelle_es = $libelle;
    }

    public function setLibelleAL($libelle) {
        $this->_libelle_al = $libelle;
    }

    public function setLibelleIT($libelle) {
        $this->_libelle_it = $libelle;
    }

    public function setSubLibelle($subLibelle) {
        $this->_sub_libelle = $subLibelle;
    }

    public function setSubLibelleEn($subLibelle) {
        $this->_sub_libelle_en = $subLibelle;
    }

    public function setSubLibelleEs($subLibelle) {
        $this->_sub_libelle_es = $subLibelle;
    }
    public function setSubLibelleAl($subLibelle) {
        $this->_sub_libelle_al = $subLibelle;
    }
    public function setSubLibelle_It($subLibelle) {
        $this->_sub_libelle_it = $subLibelle;
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

    //**** D�claration des getters ****
    public function getId() {
        return $this->_id;
    }

    public function getLibelle() {
        return $this->_libelle;
    }

    public function getLibelleEn() {
        return $this->_libelle_en;
    }

    public function getLibelleAl() {
        return $this->_libelle_al;
    }

    public function getLibelleEs() {
        return $this->_libelle_es;
    }

    public function getLibelleIt() {
        return $this->_libelle_it;
    }

    public function getSubLibelle() {
        return $this->_sub_libelle;
    }

    public function getSubLibelleEn() {
        return $this->_sub_libelle_en;
    }

    public function getSubLibelleEs() {
        return $this->_sub_libelle_es;
    }

    public function getSubLibelleAl() {
        return $this->_sub_libelle_al;
    }

    public function getSubLibelleIt() {
        return $this->_sub_libelle_it;
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
            $requete .= ",libelle_en='" . $this->_libelle_en . "'";
            $requete .= ",libelle_es='" . $this->_libelle_es . "'";
            $requete .= ",libelle_al='" . $this->_libelle_al . "'";
            $requete .= ",libelle_it='" . $this->_libelle_it . "'";
            $requete .= ",sub_libelle='" . $this->_sub_libelle . "'";
            $requete .= ",sub_libelle_en='" . $this->_sub_libelle_en . "'";
            $requete .= ",sub_libelle_es='" . $this->_sub_libelle_es . "'";
            $requete .= ",sub_libelle_al='" . $this->_sub_libelle_al . "'";
            $requete .= ",sub_libelle_it='" . $this->_sub_libelle_it . "'";
            $requete .= ",active=" . $this->_active;
            $requete .= ",pays=" . $this->_pays;
            $requete .= ",date_created='" . $this->_date_created . "'";
            $requete .= ",date_modified='" . $this->_date_modified . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO listmetier (";
            $requete .= "libelle,";
            $requete .= "libelle_en,";
            $requete .= "libelle_es,";
            $requete .= "libelle_al,";
            $requete .= "libelle_it,";
            $requete .= "sub_libelle,";
            $requete .= "sub_libelle_en,";
            $requete .= "sub_libelle_es,";
            $requete .= "sub_libelle_al,";
            $requete .= "sub_libelle_it,";
            $requete .= "active,";
            $requete .= "pays,";
            $requete .= "date_created,";
            $requete .= "date_modified";
            $requete .= ") values (";
            $requete .= "'" . $this->_libelle . "',";
            $requete .= "'" . $this->_libelle_en . "',";
            $requete .= "'" . $this->_libelle_es . "',";
            $requete .= "'" . $this->_libelle_al . "',";
            $requete .= "'" . $this->_libelle_it . "',";
            $requete .= "'" . $this->_sub_libelle . "',";
            $requete .= "'" . $this->_sub_libelle_en . "',";
            $requete .= "'" . $this->_sub_libelle_es . "',";
            $requete .= "'" . $this->_sub_libelle_al . "',";
            $requete .= "'" . $this->_sub_libelle_it . "',";
            $requete .= $this->_active . ",";
            $requete .= $this->_pays . ",";
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
        $metier->_libelle_en = $rs["libelle_en"];
        $metier->_libelle_es = $rs["libelle_es"];
        $metier->_libelle_al = $rs["libelle_al"];
        $metier->_libelle_it = $rs["libelle_it"];
        $metier->_sub_libelle = $rs["sub_libelle"];
        $metier->_sub_libelle_en = $rs["sub_libelle_en"];
        $metier->_sub_libelle_es = $rs["sub_libelle_es"];
        $metier->_sub_libelle_al = $rs["sub_libelle_al"];
        $metier->_sub_libelle_it = $rs["sub_libelle_it"];
        $metier->_active = $rs["active"];
        $metier->_pays = $rs["pays"];
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