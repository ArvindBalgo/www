<?php

class cata_support {
    //**** Variables declarations ****
    private $_id = null;
    private $_id_dimension = null;
    private $_id_support = null;
    private $_id_subcategory = null;
    private $_prix_achat = 0;
    private $_qte = 0;
    private $_coeff_support = 0;
    private $_coeff_qte = 0;

   private static $SELECT="SELECT * FROM cata_support";
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

    public function setIdDimension($id) {
        $this->_id_dimension = $id;
    }
    public function setIdSupport($id) {
            $this->_id_support= $id;
        }

    public function setIdSubCategory($id) {
        $this->_id_subcategory= $id;
    }

    public function setPrixAchat($pa) {
        $this->_prix_achat= $pa;
    }
    public function setQte($qte) {
        $this->_qte= $qte;
    }
    public function setCoeffSupport($coeff) {
        $this->_coeff_support= $coeff;
    }

    public function setCoeffQte($coeff) {
        $this->_coeff_qte= $coeff;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getIdDimension() {
        return $this->_id_dimension;
    }
    public function getIdSupport() {
        return $this->_id_support;
    }

    public function getIdSubCategory() {
        return $this->_id_subcategory;
    }

    public function getPrixAchat() {
        return $this->_prix_achat;
    }

    public function getPrixQte() {
            return $this->_qte;
        }


    public function getCoeffSupport() {
        return $this->_coeff_support;
    }


    public function getCoeffQte() {
        return $this->_coeff_qte;
    }

    public function delete($id) {
        $requete = "DELETE FROM cata_support WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE cata_support SET id_subcategory='" . ($this->_id_subcategory) . "'";
            $requete .= ",id_support='" . $this->_id_support . "'";
            $requete .= ",id_dimension='" . $this->_id_dimension . "'";
            $requete .= ",prix_achat='" . $this->_prix_achat . "'";
            $requete .= ",qte='" . $this->_qte . "'";
            $requete .= ",coeff_support='" . $this->_coeff_support . "'";
            $requete .= ",coeff_qte='" . $this->_coeff_qte . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO cata_support (";
            $requete .= "id_support,";
            $requete .= "id_dimension,";
            $requete .= "id_subcategory,";
            $requete .= "prix_achat,";
            $requete .= "qte";
            $requete .= "coeff_support";
            $requete .= "coeff_qte";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_support . "',";
            $requete .= "'" . $this->_id_dimension . "',";
            $requete .= "'" . $this->_id_subcategory . "',";
            $requete .= "'" . $this->_prix_achat . "',";
            $requete .= "'" . $this->_qte . "',";
            $requete .= "'" . $this->_coeff_support . "',";
            $requete .= "'" . $this->_coeff_qte . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $cata_support = new cata_support();
        $cata_support->_id = $rs["id"];
        $cata_support->_id_dimension = $rs["id_dimension"];
        $cata_support->_id_support = $rs["id_support"];
        $cata_support->_id_subcategory = $rs["id_subcategory"];
        $cata_support->_prix_achat = $rs["prix_achat"];
        $cata_support->_qte = $rs["qte"];
        $cata_support->_coeff_support = $rs["coeff_support"];
        $cata_support->_coeff_qte = $rs["coeff_qte"];
        return $cata_support;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listLOG =	 array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = array();
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

    public function findBySousCategory($id) {
        $requete =  "SELECT cs.id, cs.id_dimension, cs.id_support,cp.description cs.id_subcategory, cs.prix_achat, cs.qte, cs.coeff_support, cs.coeff_qte FROM cata_support cs inner join cata_papier cp on (cs.id_support = cp.id) WHERE cs.id_subcategory=" . $id;
        $rs = $this->conn->query($requete);

        if($rs){
            $rows = array();
            while($row = mysqli_fetch_array($rs))
            {
                $rows[] = $row;
            }
            return $rows;
        }
        else{
            return [];
        }

    }

    public function findByList(){
        $requete =  "SELECT cs.id, cs.id_dimension, cs.id_support,cp.description cs.id_subcategory, cs.prix_achat, cs.qte, cs.coeff_support, cs.coeff_qte FROM cata_support cs inner join cata_papier cp on (cs.id_support = cp.id) WHERE cs.id_subcategory=" . $id;
        $rs = $this->conn->query($requete);

        if($rs){
            $rows = array();
            while($row = mysqli_fetch_array($rs))
            {
                $rows[] = $row;
            }
            return $rows;
        }
        else{
            return [];
        }
    }
} 