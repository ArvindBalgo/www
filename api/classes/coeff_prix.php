<?php

class coeff_prix {
    //**** Variables declarations ****
    private $_id = null;
    private $_id_souscategory = 0;
    private $_id_support = 0;
    private $_qte = 0;
    private $_coeff_prix = 0;
    private $_coeff_qte = 0;
    private $_id_souscategory_coeffprix = 0;

   private static $SELECT="SELECT * FROM coeff_prix";
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

    public function setIdSousCategory($id) {
        $this->_id_souscategory= $id;
    }

    public function setIdSupport($id) {
        $this->_id_support= $id;
    }

    public function setQte($qte) {
        $this->_qte= $qte;
    }

    public function setCoeffPrix($cp) {
        $this->_coeff_prix= $cp;
    }

    public function setCoeffQte($cq) {
        $this->_coeff_qte= $cq;
    }

    public function setIdSouscategoryPrix($id) {
        $this->_id_souscategory_coeffprix= $id;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getIdSousCategory() {
        return $this->_id_souscategory;
    }

    public function getIdSupport() {
        return $this->_id_support;
    }

    public function getQte() {
        return $this->_qte;
    }

    public function getCoeffPrix() {
        return $this->_coeff_prix;
    }

    public function getCoeffQte() {
        return $this->_coeff_qte;
    }

    public function getIdSousCategoryPrix() {
        return $this->_id_souscategory_coeffprix;
    }

    public function delete($id) {
        $requete = "DELETE FROM coeff_prix WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE coeff_prix SET qte=" . ($this->_qte) . "";
            $requete .= " , id_souscategory=" . $this->_id_souscategory;
            $requete .= " , id_support=" . $this->_id_support;
            $requete .= " , coeff_prix=" . $this->_coeff_prix;
            $requete .= " , coeff_qte=" . $this->_coeff_qte;
            $requete .= " , id_souscategory_coeffprix=" . $this->_id_souscategory_coeffprix;
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO coeff_prix (";
            $requete .= "id_souscategory";
            $requete .= ",id_support";
            $requete .= ",qte";
            $requete .= ",coeff_prix";
            $requete .= ",coeff_qte";
            $requete .= ",id_souscategory_coeffprix";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_souscategory . "',";
            $requete .= "'" . $this->_id_support . "',";
            $requete .= "'" . $this->_qte . "',";
            $requete .= "'" . $this->_coeff_prix . "',";
            $requete .= "'" . $this->_coeff_qte . "',";
            $requete .= "'" . $this->_id_souscategory_coeffprix . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        if(!$rs) {
            return 'false';
        }
        $coeff_p = new coeff_prix();
        $coeff_p->_id = $rs["id"];
        $coeff_p->_id_souscategory = $rs["id_souscategory"];
        $coeff_p->_id_support = $rs["id_support"];
        $coeff_p->_qte = $rs["qte"];
        $coeff_p->_coeff_prix = $rs["coeff_prix"];
        $coeff_p->_coeff_qte = $rs["coeff_qte"];
        $coeff_p->_id_souscategory_coeffprix = $rs["id_souscategory_coeffprix"];
        return $coeff_p;
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

    public function findByQteSupportSCategory($qte, $idSupport, $sousCategory, $tarifid) {
        $requete = self::$SELECT . " WHERE qte=" . $qte . " and id_support=".$idSupport ." and id_souscategory=".$sousCategory." and id_souscategory_coeffprix=".$tarifid;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findBySousCategory($id, $tarifid) {
        $requete = self::$SELECT ." where id_souscategory=".$id." and id_souscategory_coeffprix=".$tarifid;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function getListIdPapierSupport($idSousCategory, $tarifid){
        $requete = "SELECT GROUP_CONCAT(DISTINCT(id_support)) as ligne FROM coeff_prix  where id_souscategory=".$idSousCategory." and id_souscategory_coeffprix=".$tarifid;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $row  = mysqli_fetch_array($rs);
        if(!$row) {
            return '';
        }
        return $row;
    }

    public function delBySousCategoryPapier($idcategory , $support, $tarifid) {
        $requete = "delete from coeff_prix where id_souscategory=".$idcategory."  and id_support=".$support." and id_souscategory_coeffprix=".$tarifid;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return 'done';
    }

    public function delByIdSousCategoryCoeffPrix($id) {
        $requete = "delete from coeff_prix where id_souscategory_coeffprix=".$id;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return 'done';
    }



    public function findByProduit($tarif) {
        $requete = "select c.id, c.id_souscategory, c.id_souscategory_coeffprix, c.id_support, c.qte, c.coeff_prix, c.coeff_qte, cp.description from coeff_prix c inner join cata_papier cp on c.id_support = cp.id where c.id_souscategory_coeffprix=".$tarif;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

}