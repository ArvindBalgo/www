<?php

class coupon_details
{
    //**** Variables declarations ****
    private $_id = null;
    private $_id_coupon = "";
    private $_id_user = "";
    private $_id_order = "";
    private $_email = "";
    private $_flag = "";
    private $_date_used = "";

    private static $SELECT = "SELECT * FROM coupon_details";

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

    public function setIdCoupon($val)
    {
        $this->_id_coupon = $val;
    }

    public function setIdOrder($val)
    {
        $this->_id_order = $val;
    }

    public function setIdUser($val)
    {
        $this->_id_user = $val;
    }

    public function setEmail($val)
    {
        $this->_email = $val;
    }

    public function setFlag($val)
    {
        $this->_flag = $val;
    }

    public function setDateUsed($val)
    {
        $this->_date_used = $val;
    }

    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getIdCoupon()
    {
        return $this->_id_coupon;
    }

    public function getIdOrder()
    {
        return $this->_id_order;
    }

    public function getIdUser()
    {
        return $this->_id_user;
    }

    public function getEmail()
    {
        return $this->_email;
    }

    public function getFlag()
    {
        return $this->_flag;
    }

    public function getDateUsed()
    {
        return $this->_date_used;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM coupon_details WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE coupon_details SET id_coupon='" . ($this->_id_coupon) . "'";
            $requete .= ", id_user='" . ($this->_id_user) . "'";
            $requete .= ", id_order='" . ($this->_id_order) . "'";
            $requete .= ", email='" . ($this->_email) . "'";
            $requete .= ", flag='" . ($this->_flag) . "'";
            $requete .= ", date_used='" . ($this->_date_used) . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO coupon_details (";
            $requete .= "id_coupon,";
            $requete .= "id_user,";
            $requete .= "id_order,";
            $requete .= "email,";
            $requete .= "flag,";
            $requete .= "date_used";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_coupon . "',";
            $requete .= "'" . $this->_id_user . "',";
            $requete .= "'" . $this->_id_order . "',";
            $requete .= "'" . $this->_email . "',";
            $requete .= "'" . $this->_flag . "',";
            $requete .= "'" . $this->_date_used . "')";
        }
        chromePHP::log($requete);
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $couponDetail = new coupon_details();
        $couponDetail->_id = $rs["id"];
        $couponDetail->_id_coupon = $rs["id_coupon"];
        $couponDetail->_id_order = $rs["id_order"];
        $couponDetail->_id_user = $rs["id_user"];
        $couponDetail->_email = $rs["email"];
        $couponDetail->_flag = $rs["flag"];
        $couponDetail->_date_used = $rs["date_used"];
        return $couponDetail;
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
    public function findByCouponCode($key)
        { // Recherche d'une adresse par id
            $requete = self::$SELECT . " WHERE id_coupon=" . $key;
            $rs = $this->conn->query($requete);

            $rows = [];
            while ($row = mysqli_fetch_array($rs)) {
                $rows[] = $row;
            }
            return $rows;
        }

    public function getCountByCoupon($id) {
        $requete = "select count(*) as cnt from coupon_details where id_coupon=".$id;
        $rs = $this->conn->query($requete);
        return mysqli_fetch_array($rs);
    }

    public function getCountByCouponUsed($id) {
        $requete = "select count(*) as usedCnt from coupon_details where flag='USED' and id_coupon=".$id;
        $rs = $this->conn->query($requete);
        return mysqli_fetch_array($rs);
    }
}