<?php

class kliknpay
{
    //**** Variables declarations ****
    private $_id = null;
    private $_NUMXKP = "";
    private $_PAIEMENT = "";
    private $_MONTANTXKP = "";
    private $_DEVISEXKP = "";
    private $_IPXKP = "";
    private $_PAYSRXKP = "";
    private $_SCOREXKP = "";
    private $_PAYSBXKP = "";

    private static $SELECT = "SELECT * FROM kliknpay";

    //**** Constructeur ****
    public function __construct()
    {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId($id)
    {
        $this->_id = $id;
    }

    public function setNUMXKP($val)
    {
        $this->_NUMXKP = $val;
    }

    public function setPAIEMENT($val)
    {
        $this->_PAIEMENT = $val;
    }

    public function setMONTANTXKP($val)
    {
        $this->_MONTANTXKP = $val;
    }

    public function setDEVISEXKP($val)
    {
        $this->_DEVISEXKP = $val;
    }

    public function setIPXKP($val)
    {
        $this->_IPXKP = $val;
    }

    public function setPAYSRXKP($val)
    {
        $this->_PAYSRXKP = $val;
    }

    public function setSCOREXKP($val)
    {
        $this->_SCOREXKP = $val;
    }

    public function setPAYSBXKP($val)
    {
        $this->_PAYSBXKP = $val;
    }

    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getNUMXKP()
    {
        return $this->_NUMXKP;
    }

    public function getPAIEMENT()
    {
        return $this->_PAIEMENT;
    }

    public function getMONTANTXKP()
    {
        return $this->_MONTANTXKP;
    }

    public function getDEVISEXKP()
    {
        return $this->_DEVISEXKP;
    }

    public function getIPXKP()
    {
        return $this->_IPXKP;
    }

    public function getPAYSRXKP()
    {
        return $this->_PAYSRXKP;
    }

    public function getSCOREXKP()
    {
        return $this->_SCOREXKP;
    }

    public function getPAYSBXKP()
    {
        return $this->_PAYSBXKP;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM kliknpay WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE kliknpay SET NUMXKP='" . ($this->_NUMXKP) . "',";
            $requete .= " PAIEMENT '=" . $this->_PAIEMENT."',";
            $requete .= " MONTANTXKP '=" . $this->_MONTANTXKP."',";
            $requete .= " DEVISEXKP '=" . $this->_DEVISEXKP."',";
            $requete .= " IPXKP '=" . $this->_IPXKP."',";
            $requete .= " PAYSRXKP '=" . $this->_PAYSRXKP."',";
            $requete .= " SCOREXKP '=" . $this->_SCOREXKP."',";
            $requete .= " PAYSBXKP '=" . $this->_PAYSBXKP."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO kliknpay (";
            $requete .= "PAIEMENT,";
            $requete .= "MONTANTXKP,";
            $requete .= "DEVISEXKP,";
            $requete .= "IPXKP,";
            $requete .= "PAYSRXKP,";
            $requete .= "SCOREXKP,";
            $requete .= "PAYSBXKP,";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_PAIEMENT . "',";
            $requete .= "'" . $this->_MONTANTXKP . "',";
            $requete .= "'" . $this->_DEVISEXKP . "',";
            $requete .= "'" . $this->_IPXKP . "',";
            $requete .= "'" . $this->_PAYSRXKP . "',";
            $requete .= "'" . $this->_SCOREXKP . "',";
            $requete .= "'" . $this->_PAYSBXKP . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $kliknpay = new kliknpay();
        $kliknpay->_id = $rs["id"];
        $kliknpay->_NUMXKP = $rs["NUMXKP"];
        $kliknpay->_PAIEMENT = $rs["PAIEMENT"];
        $kliknpay->_MONTANTXKP = $rs["MONTANTXKP"];
        $kliknpay->_DEVISEXKP = $rs["DEVISEXKP"];
        $kliknpay->_IPXKP = $rs["IPXKP"];
        $kliknpay->_PAYSRXKP = $rs["PAYSRXKP"];
        $kliknpay->_SCOREXKP = $rs["SCOREXKP"];
        $kliknpay->_PAYSBXKP = $rs["PAYSBXKP"];
        return $kliknpay;
    }

    public function rechercher()
    { // Recherche de toutes les adresses
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByPrimaryKey($key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
}