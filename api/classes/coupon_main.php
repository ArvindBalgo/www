<?php

class coupon_main
{
    //**** Variables declarations ****
    private $_id = null;
    private $_date_start = "";
    private $_date_end = "";
    private $_coupon_code = "";
    private $_val= 0;

    private static $SELECT = "SELECT * FROM coupon_main";

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

    public function setDateStart($val)
    {
        $this->_date_start = $val;
    }

    public function setDateEnd($val)
    {
        $this->_date_end = $val;
    }

    public function setCouponCode($val)
    {
        $this->_coupon_code = $val;
    }

    public function setVal($val)
    {
        $this->_val = $val;
    }

    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getDateStart()
    {
        return $this->_date_start;
    }

    public function getDateEnd()
    {
        return $this->_date_end;
    }

    public function getCouponCode()
    {
        return $this->_coupon_code;
    }
    public function getVal()
    {
        return $this->_val;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM coupon_main WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE coupon_main SET date_start='" . ($this->_date_start) . "'";
            $requete .= ", date_end='".($this->_date_end)."'";
            $requete .= ", coupon_code='".($this->_coupon_code)."'";
            $requete .= ", val='".($this->_val)."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO coupon_main (";
            $requete .= "date_start,";
            $requete .= "date_end,";
            $requete .= "coupon_code,";
            $requete .= "val";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_date_start. "',";
            $requete .= "'" . $this->_date_end. "',";
            $requete .= "'" . $this->_coupon_code. "',";
            $requete .= "'" . $this->_val. "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $couponMain = new coupon_main();
        $couponMain->_id = $rs["id"];
        $couponMain->_date_start= $rs["date_start"];
        $couponMain->_date_end= $rs["date_end"];
        $couponMain->_coupon_code= $rs["coupon_code"];
        $couponMain->_val= $rs["val"];
        return $couponMain;
    }

    public function rechercher()
    { // Recherche de toutes les adresses
        $listLOG = array();
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

    public function getMaxId()
    {
        $requete = "select max(id) as id from coupon_main ";
        $rs = $this->conn->query($requete);
        return mysqli_fetch_array($rs);
    }
}