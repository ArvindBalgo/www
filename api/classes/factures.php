<?php
class factures {
    //**** Variables declarations ****
    private $_id = null;
    private $_id_order = "";
    private $_pdf_src = "";

   private static $SELECT="SELECT * FROM factures";
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

    public function setIdOrder($val) {
        $this->_id_order= $val;
    }
    public function setPdfSrc($val) {
        $this->_pdf_src= $val;
    }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getIdOrder() {
        return $this->_id_order;
    }

    public function getPdfSrc() {
        return $this->_pdf_src;
    }

    public function delete($id) {
        $requete = "DELETE FROM factures WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE factures SET id_order='" . ($this->_id_order) . "'";
            $requete .= ", pdf_src='".$this->_pdf_src."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO factures (";
            $requete .= "id_order";
            $requete .= ",pdf_src";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_order . "',";
            $requete .= "'" . $this->_pdf_src. "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $bill = new factures();
        $bill->_id = $rs["id"];
        $bill->_id_order= $rs["id_order"];
        $bill->_pdf_src= $rs["pdf_src"];
        return $bill;
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

    public function rechByOrder() { // Recherche de toutes les adresses
        $listLOG =	 array();
        $requete = "SELECT om.id, om.id_user, om.status, om.tax, om.total_livraison_ht, om.total_livraison_ht, om.total_livraison_ttc, om.total_prix_ht, om.total_prix_net, om.total_prix_ttc, f.id as id_facture, f.pdf_src FROM orders_main om LEFT JOIN factures f on (om.id = f.id_order) ORDER by om.id DESC ";
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
}