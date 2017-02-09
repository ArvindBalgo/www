<?php
class modelmetier{

    //**** D�claration des variables ****
    private $_id            = 0;
    private $_description   = "";
    private $_key_libelle   = "";
    private $_category      = null;
    private $_src           = null;
    private $_qte           = null;
    private $_active        = null;

    private static $SELECT = "SELECT * FROM modelmetier";

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

    public function setKeyLibelle($key) {
        $this->_key_libelle = $key;
    }

    public function setCategory($category) {
        $this->_category = $category;
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

    public function getKeyLibelle() {
        return $this->_key_libelle;
    }

    public function getCategory() {
        return $this->_category;
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
        $requete = "DELETE FROM modelmetier WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }

    //***** fonction de modification/cr�ation *****
    public function save() {
        if ($this->_id > 0) {
            $requete = "update modelmetier set description='" . ($this->_description) . "'";
            $requete .= ",category='" . $this->_category . "'";
            $requete .= ",key_libelle='" . $this->_key_libelle . "'";
            $requete .= ",src='" . $this->_src."'";
            $requete .= ",qte='" . $this->_qte."'";
            $requete .= ",active=" . $this->_active;
            $requete .= " where id=" . $this->_id;

        } else {
            $requete = "INSERT INTO modelmetier (";
            $requete .= "description,";
            $requete .= "key_libelle,";
            $requete .= "category,";
            $requete .= "src,";
            $requete .= "qte,";
            $requete .= "active";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_description . "',";
            $requete .= "'" . $this->_key_libelle . "',";
            $requete .= "'" . $this->_category . "',";
            $requete .= "'" . $this->_src . "',";
            $requete .= "'" . $this->_qte . "',";
            $requete .= "'" . $this->_active . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $metier = new modelmetier();
        $metier->_id = $rs["id"];
        $metier->_description = $rs["description"];
        $metier->_key_libelle = $rs["key_libelle"];
        $metier->_category = $rs["category"];
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
        $requete = "SELECT c.id, concat(l.libelle , ' - ' , m.description, ' - ', c.description) as text from listmetier l inner join modelmetier m on l.id = m.category inner join modelmetier_category c on m.id = c.id_modelmetier";
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
        if (!$rs) {
            return null;
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function  rechModelCategory(){
        $requete = "SELECT mm.id as modelid, mm.description as modeldescription, mm.category as modelcategory, mmc.id as categoryid, mmc.description as categorydescription  FROM modelmetier mm inner join modelmetier_category mmc on (mm.id = mmc.id_modelmetier)";

        $rs = $this->conn->query($requete) or die($this->conn->error._LINE_);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }
}