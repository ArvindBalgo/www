<?php

class tarif_manuel {
    //**** Variables declarations ****
    private $_id = null;
    private $_id_cata = 0;
    private $_id_support = 0;
    private $_qte = 0;
    private $_prix_vente = 0;
    private $_id_dim = 0;
    private $_lib_dim = "";

   private static $SELECT="SELECT * FROM tarif_manuel";
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

    public function setIdCata($id) {
        $this->_id_cata= $id;
    }

    public function setSupport($id) {
        $this->_id_support= $id;
    }

    public function setQte($qte) {
        $this->_qte= $qte;
    }

    public function setPrixVente($pv) {
        $this->_prix_vente= $pv;
    }

    public function setIdDim($id) {
        $this->_id_dim= $id;
    }

    public function setLibDim($libelle) {
        $this->_lib_dim = $libelle;
    }
    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getIdCata() {
        return $this->_id_cata;
    }

    public function getIdSupport() {
        return $this->_id_support;
    }

    public function getQte() {
        return $this->_qte;
    }

    public function getPrixVente() {
        return $this->_prix_vente;
    }

    public function getIdDim() {
        return $this->_id_dim;
    }

    public function getLibDim() {
        return $this->_lib_dim;
    }
    public function delete($id) {
        $requete = "DELETE FROM tarif_manuel WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    public function deleteByCata($id) {
        $requete = "DELETE FROM tarif_manuel WHERE id_cata=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }
    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE tarif_manuel SET id_cata=" . intval($this->_id_cata) . "";
            $requete .= " , qte=" . intval($this->_qte);
            $requete .= " , id_support=" . $this->_id_support;
            $requete .= " , prix_vente=" . $this->_prix_vente;
            $requete .= " , id_dim=" . $this->_id_dim;
            $requete .= " , lib_dim=" . $this->_lib_dim;
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO tarif_manuel (";
            $requete .= "id_cata";
            $requete .= ",qte";
            $requete .= ",id_support";
            $requete .= ",prix_vente";
            $requete .= ",id_dim";
            $requete .= ",lib_dim";
            $requete .= ") VALUES (";
            $requete .= "'" . intval($this->_id_cata) . "',";
            $requete .= "'" . intval($this->_qte) . "',";
            $requete .= "'" . intval($this->_id_support) . "',";
            $requete .= "'" . ($this->_prix_vente) . "',";
            $requete .= "'" . intval($this->_id_dim) . "',";
            $requete .= "'" . ($this->_lib_dim) . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        if(!$rs){
            return "false";
        }
        $tarifManuel = new tarif_manuel();
        $tarifManuel->_id = $rs["id"];
        $tarifManuel->_id_cata = $rs["id_cata"];
        $tarifManuel->_id_support = $rs["id_support"];
        $tarifManuel->_qte = $rs["qte"];
        $tarifManuel->_prix_vente = $rs["prix_vente"];
        $tarifManuel->_id_dim = $rs["id_dim"];
        $tarifManuel->_lib_dim = $rs["lib_dim"];
        return $tarifManuel;
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

    public function findByIDCataSupportQte($idCata, $idSupport, $qte, $idDim) {
        $requete = self::$SELECT . " WHERE id_cata=" . intval($idCata) . " and id_support=".intval($idSupport)." and qte=".intval($qte) ." and id_dim=".intval($idDim);
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findByIDCata($idCata) {
        $requete = self::$SELECT . " WHERE id_cata=" . intval($idCata);
        $rs = $this->conn->query($requete);

        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function getListIdPapierSupport($idCata){
        $requete = "SELECT GROUP_CONCAT(DISTINCT(id_support)) as ligne FROM tarif_manuel  where id_cata=".$idCata;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $row  = mysqli_fetch_array($rs);
        if(!$row) {
            return '';
        }
        return $row;
    }
    
    public function getDimsByCata($idCata) {
        $requete = "select distinct(id_dim) from tarif_manuel where id_cata=".$idCata;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }
    public function getSupportById($idCata) {
        $requete = "SELECT GROUP_CONCAT(DISTINCT(id_support)) as ligne FROM tarif_manuel  where id_cata=".$idCata;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $row  = mysqli_fetch_array($rs);
        if(!$row) {
            return '';
        }
        return $row;
    }
} 