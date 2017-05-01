<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */

class cata {
    //**** Variables declarations ****
    private $_id_cata = null;
    private $_libelle = null;
    private $_description = null;
    private $_key_description = "";
    private $_src = null;
    private $_id_front = null;
    private $_id_back = null;
    private $_reference = null;
    private $_dimensions = "";
    private $_escargot = false;
    private $_contours = false;
    private $_liserai = false;
    private $_coucher = false;
    private $_gabarit   = false;
    private $_date_created = null;
    private $_date_modified = null;
    private $_created_by = null;
    private $_modified_by = null;
    private $_id_souscategory_coeffprix = 0;
    private $_pays = 0;

   private static $SELECT="SELECT * FROM cata";
    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId_Cata($id_cata) {
        $this->_id_cata= $id_cata;
    }

    public function setLibelle($libelle) {
        $this->_libelle= $libelle;
    }
    public function setDescription($description) {
        $this->_description= $description;
    }
    public function setKeyDescription($key) {
        $this->_key_description= $key;
    }
    public function setSrc($src) {
        $this->_src= $src;
    }

    public function setIdFront($id_front) {
        $this->_id_front= $id_front;
    }
    public function setIdBack($id_back) {
        $this->_id_back= $id_back;
    }
    public function setReference($ref) {
        $this->_reference= $ref;
    }

    public function setDimensions($dim) {
        $this->_dimensions = $dim;
    }
    public function setEscargot($escargot) {
        $this->_escargot = $escargot;
    }

    public function setContours($contours) {
        $this->_contours = $contours;
    }

    public function setLiserai($liserai) {
        $this->_liserai = $liserai;
    }

    public function setCoucher($coucher) {
        $this->_coucher = $coucher;
    }

    public function setGabarit($gabarit) {
        $this->_gabarit = $gabarit;
    }

    public function setCreatedBy($user) {
        $this->_created_by= $user;
    }
    public function setModifiedBy($user) {
        $this->_modified_by= $user;
    }

    public function setIdSousCategoryCoeffPRix($id) {
        $this->_id_souscategory_coeffprix= $id;
    }

    public function setPays($pays) {
        $this->_pays = $pays;
    }

    //**** Getters *****

    public function getId_Cata() {
        return $this->_id_cata;
    }

    public function getLibelle() {
        return $this->_libelle;
    }


    public function getDescription() {
        return $this->_description;
    }

    public function getKeyDescription() {
        return $this->_key_description;
    }

    public function getSrc() {
        return $this->_src;
    }

    public function getIdFront() {
        return $this->_id_front;
    }

    public function getIdBack() {
        return $this->_id_back;
    }

    public function getReference() {
        return $this->_reference;
    }

    public function getDimensions (){
        return $this->_dimensions;
    }

    public function getEscargot (){
        return $this->_escargot;
    }
    public function getContours (){
        return $this->_contours;
    }

    public function getLiserai (){
        return $this->_liserai;
    }

    public function getCoucher (){
        return $this->_coucher;
    }

    public function getGabarit(){
        return $this->_gabarit;
    }

    public function getDateCreated() {
        return $this->_date_created;
    }

    public function getDateModified() {
        return $this->_date_modified;
    }


    public function getCreatedBy() {
        return $this->_created_by;
    }

    public function getModifiedBy() {
        return $this->_modified_by;
    }

    public function getIdSousCategoryCoeffPrix() {
        return $this->_id_souscategory_coeffprix;
    }

    public function getPays() {
        return $this->_pays;
    }

    public function delete($id) {
        $requete = "DELETE FROM cata WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        // $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
        }
        if ($this->_date_modified == null) {
            $this->_date_modified = date('Y/m/d H:i:s', time());
        }

        if ($this->_id_cata > 0) {
            $requete = 'UPDATE cata SET libelle="' . ($this->_libelle) . '"';
            $requete .= ',description="' . $this->_description . '"';
            $requete .= ',key_description="' . $this->_key_description . '"';
            $requete .= ',src="' . $this->_src . '"';
            $requete .= ',id_front="' . $this->_id_front . '"';
            $requete .= ',id_back="' . $this->_id_back . '"';
            $requete .= ',reference="' . $this->_reference . '"';
            $requete .= ',dimensions="' . $this->_dimensions . '"';
            $requete .= ',escargot="' . $this->_escargot . '"';
            $requete .= ',contours="' . $this->_contours . '"';
            $requete .= ',liserai="' . $this->_liserai . '"';
            $requete .= ',coucher="' . $this->_coucher . '"';
            $requete .= ',gabarit="' . $this->_gabarit . '"';
            $requete .= ',date_created="' . $this->_date_created . '"';
            $requete .= ',date_modified="' . $this->_date_modified . '"';
            $requete .= ',created_by="' . $this->_created_by . '"';
            $requete .= ',modified_by="' . $this->_modified_by . '"';
            $requete .= ',id_souscategory_coeffprix="' . $this->_id_souscategory_coeffprix . '"';
            $requete .= ',pays="' . $this->_pays . '"';
            $requete .= ' WHERE id=' . $this->_id_cata;

        } else {
            $requete = "INSERT INTO cata (";
            $requete .= "libelle,";
            $requete .= "description,";
            $requete .= "key_description,";
            $requete .= "src,";
            $requete .= "id_front,";
            $requete .= "id_back,";
            $requete .= "reference,";
            $requete .= "dimensions,";
            $requete .= "escargot,";
            $requete .= "contours,";
            $requete .= "liserai,";
            $requete .= "coucher,";
            $requete .= "gabarit,";
            $requete .= "date_created,";
            $requete .= "date_modified,";
            $requete .= "created_by,";
            $requete .= "modified_by,";
            $requete .= "id_souscategory_coeffprix,";
            $requete .= "pays";
            $requete .= ") VALUES (";
            $requete .= '"' . $this->_libelle . '",';
            $requete .= '"' . $this->_description . '",';
            $requete .= '"' . $this->_key_description . '",';
            $requete .= '"' . $this->_src . '",';
            $requete .= '"' . $this->_id_front . '",';
            $requete .= '"' . $this->_id_back . '",';
            $requete .= '"' . $this->_reference . '",';
            $requete .= '"' . $this->_dimensions . '",';
            $requete .= '"' . $this->_escargot . '",';
            $requete .= '"' . $this->_contours . '",';
            $requete .= '"' . $this->_liserai . '",';
            $requete .= '"' . $this->_coucher . '",';
            $requete .= '"' . $this->_gabarit . '",';
            $requete .= '"' . $this->_date_created . '",';
            $requete .= '"' . $this->_date_modified . '",';
            $requete .= '"' . $this->_created_by . '",';
            $requete .= '"' . $this->_modified_by . '",';
            $requete .= '"' . $this->_id_souscategory_coeffprix . '",';
            $requete .= '"' . $this->_pays . '")';
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $cata = new cata();
        $cata->_id_cata             = $rs["id"];
        $cata->_libelle             = $rs["libelle"];
        $cata->_description         = $rs["description"];
        $cata->_key_description     = $rs["key_description"];
        $cata->_src                 = $rs["src"];
        $cata->_id_front            = $rs["id_front"];
        $cata->_id_back             = $rs["id_back"];
        $cata->_reference           = $rs["reference"];
        $cata->_dimensions          = $rs["dimensions"];
        $cata->_escargot            = $rs["escargot"];
        $cata->_contours            = $rs["contours"];
        $cata->_liserai             = $rs["liserai"];
        $cata->_coucher             = $rs["coucher"];
        $cata->_gabarit             = $rs["gabarit"];
        $cata->_date_created        = $rs["date_created"];
        $cata->_date_modified       = $rs["date_modified"];
        $cata->_created_by          = $rs["created_by"];
        $cata->_modified_by         = $rs["modified_by"];
        $cata->_id_souscategory_coeffprix = $rs["id_souscategory_coeffprix"];
        $cata->_pays                = $rs["pays"];
        return $cata;
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

    public function getLastId(){
        $requete = "SELECT MAX(id) AS id FROM cata";
        $rs = $this->conn->query($requete);
        $result = mysqli_fetch_array($rs);
        return $result["id"];
    }

    public function findAllByMetier($id){
        $requete = "select * from cata c inner join cata_metier cm on c.id = cm.id_cata where cm.id_metier=".$id;
        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findAllByIdCataRange($str){
        $requete = "SELECT * FROM cata C WHERE C.id IN ($str)";
        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findAllBySousCategory($id){
        $requete = "Select * from cata C inner join cata_metier cm on (C.id = cm.id_cata) where cm.id_modelmetier=".$id;

        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function fnFindAllModelCategory($id){
        $requete = "SELECT
                    m.*,
                    (SELECT COUNT(*)
                    FROM cata_metier
                    WHERE cata_metier.id_modelmetier= m.id) AS counts
                    FROM modelmetier_category  m
                    where m.id_modelmetier=".$id;

        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findAllByModelMetier($id){
        $requete = "select * from cata c inner join cata_metier cm on c.id = cm.id_cata where cm.id_modelmetier=".$id;
        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findDimsByModelMetier($id) {
        $requete =  "select dimensions from cata c inner join cata_metier cm on c.id = cm.id_cata where dimensions != '' and cm.id_metier=".$id;
        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findDimsByModel($id) {
        $requete =  "select dimensions from cata c inner join cata_metier cm on c.id = cm.id_cata where dimensions != '' and cm.id_modelmetier=".$id;
        $rs = $this->conn->query($requete);

        $rows = "";
        while($row = mysqli_fetch_array($rs))
        {
            $rows .= $row["dimensions"] .",";
        }
        return $rows;
    }

    public function findDimsQte($id) {
        $query = "SELECT c.id as id_produit, c.dimensions as str_dimensions, mm.id as id_modelmetier, mm.qte as str_qte FROM cata c inner join cata_metier cm on c.id = cm.id_cata inner join modelmetier mm on cm.id_metier = mm.id where c.id=".$id;
        $rs = $this->conn->query($query);

        return mysqli_fetch_array($rs);
    }
}