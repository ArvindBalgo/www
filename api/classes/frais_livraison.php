<?php

class frais_livraison {
    //**** Variables declarations ****
    private $_id = null;
    private $_id_modelmetier = 0;
    private $_id_produit = 0;
    private $_dimension = 0;
    private $_qte = 0;
    private $_weight = 0;
    private $_price = 0;
    private $_pays = "FR";

   private static $SELECT="SELECT * FROM frais_livraison";
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

    public function setIdModelMetier($id) {
        $this->_id_modelmetier= $id;
    }
    public function setQte($qte) {
        $this->_qte= $qte;
    }
    public function setWeight($wg) {
        $this->_weight= $wg;
    }
    public function setPrice($prix) {
        $this->_price= $prix;
    }

    public function setIdProduit($idproduit) {
        $this->_id_produit= $idproduit;
    }

    public function setDimension($dimension) {
        $this->_dimension= $dimension;
    }

    public function setPays($pay) {
            $this->_pays= $pay;
        }

    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getIdModelMetier() {
        return $this->_id_modelmetier;
    }

    public function getQte() {
        return $this->_qte;
    }

    public function getWeight() {
        return $this->_weight;
    }

    public function getPrice() {
        return $this->_price;
    }


    public function getIdProduit() {
        return $this->_id_produit;
    }


    public function getDimension() {
        return $this->_dimension;
    }

    public function getPays() {
        return $this->_pays;
    }

    public function delete($id) {
        $requete = "DELETE FROM frais_livraison WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE frais_livraison SET id_modelmetier='" . ($this->_id_modelmetier) . "'";
            $requete .= ", qte=".$this->_qte;
            $requete .= ", weight=".$this->_weight;
            $requete .= ", price=".$this->_price;
            $requete .= ", id_produit=".$this->_id_produit;
            $requete .= ", dimension='".$this->_dimension."'";
            $requete .= ", pays='".$this->_pays."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO frais_livraison (";
            $requete .= "id_modelmetier";
            $requete .= ",qte";
            $requete .= ",weight";
            $requete .= ",price";
            $requete .= ",id_produit";
            $requete .= ",dimension";
            $requete .= ",pays";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_modelmetier. "',";
            $requete .= "'" . $this->_qte. "',";
            $requete .= "'" . $this->_weight. "',";
            $requete .= "'" . $this->_price. "',";
            $requete .= "'" . $this->_id_produit. "',";
            $requete .= "'" . $this->_dimension. "',";
            $requete .= "'" . $this->_pays. "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        if(!$rs || $rs == null ) {
            return false;
        }
        $frais_livraison = new frais_livraison();
        $frais_livraison->_id = $rs["id"];
        $frais_livraison->_id_modelmetier= $rs["id_modelmetier"];
        $frais_livraison->_qte = $rs["qte"];
        $frais_livraison->_weight = $rs["weight"];
        $frais_livraison->_price = $rs["price"];
        $frais_livraison->_id_produit = $rs["id_produit"];
        $frais_livraison->_dimension = $rs["dimension"];
        $frais_livraison->_pays = $rs["pays"];
        return $frais_livraison;
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

    public function updateByBulk($id, $qte, $weight, $price) {
        $requete = "update frais_livraison set price=".$price.", weight=".$weight." where id_modelmetier=".$id." and manuel = 0 and qte=".$qte;
        $rs = $this->conn->query($requete);
        return "done";
    }

    public function findByIdParentModelMetierQte($key, $qte, $idprod) { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id_modelmetier=" . $key ." and qte=".$qte ." and id_produit=".$idprod;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function findByIdModelMetier($id, $idprod) {
        $requete = self::$SELECT." where id_modelmetier=".$id ." and id_produit=".$idprod." order by qte";
        chromePHP::log($requete);
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }

    public function deleleDuplicates() {
        //SELECT GROUP_CONCAT(id), COUNT(*) c from frais_livraison GROUP by id_modelmetier, id_produit, qte HAVING c>1
        $requete = "SELECT GROUP_CONCAT(id) idn, COUNT(*) c from frais_livraison where manuel=0 GROUP by id_modelmetier, id_produit, qte HAVING c>1";
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $query = "delete from frais_livraison where id in (".$row["idn"].")";
            $rrr = $this->conn->query($query) or die($this->conn->error.__LINE__);
            /*chromePHP::log($query);
            $rrr = $this->conn->query($query) or die($this->conn->error.__LINE__);
            chromePHP::log($rrr);*/
           /* $arrIDNS = explode(",", $row["idn"]);
            foreach ($arrIDNS as $item) {
                $query = "delete from frais_livraison where id=".$item;
            }
            $arrIDNS = array_pop($arrIDNS);
            $row["idn"] = implode($arrIDNS);
            $rows[] = $row;*/
        }
        $requete = "SELECT GROUP_CONCAT(id) idn, COUNT(*) c from frais_livraison where manuel=1 GROUP by id_modelmetier, id_produit, qte HAVING c>1";
        $result = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        while($row = mysqli_fetch_array($result))
        {
            $data = explode(",", $row["idn"]);
            $newData = array_pop($data);
            $newStr = implode(",",$data);
            $query = "delete from frais_livraison where id in (".$newStr.")";
            $rrr = $this->conn->query($query) or die($this->conn->error.__LINE__);
        }
        return "done";
    }

    public function findByIdDimQte($id_produit, $dimension, $qte, $pays){
        $requete = self::$SELECT." where id_produit=".$id_produit." and dimension='".$dimension."' and qte=".$qte." and pays='".$pays."'";
        $result = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return mysqli_fetch_array($result);
    }

    public function findByIdProd($idProduit, $pays) {
        $requete = self::$SELECT." where id_produit=".$idProduit." and pays='".$pays."'";
        $rs = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            $rows[] = $row;
        }
        return $rows;
    }
}