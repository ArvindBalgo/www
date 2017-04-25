<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:46
 */
/*
 * --
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id_payment` int(10) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_order` int(10) NOT NULL,
  `amount_total` float NOT NULL,
  `amount_paid` float NOT NULL,
  `amount_remaining` float NOT NULL,
  `payment_method` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id_payment`);


--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id_payment` int(10) NOT NULL AUTO_INCREMENT;
 */

class payment {

    //**** Variables declarations ****
    private $_id_payment = null;
    private $_date_created = null;
    private $_date_modified = null;
    private $_id_order = null;
    private $_amount_total = null;
    private $_amount_paid = null;
    private $_amount_remaining = null;
    private $_payment_method = null;

    private static $SELECT="SELECT * FROM PAYMENT";
    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId_payment($id_payment) {
        $this->_id_payment= $id_payment;
    }

    public function setDate_created($date_created) {
        $this->_date_created= $date_created;
    }

    public function setDate_modified($date_modified) {
        $this->_date_modified= $date_modified;
    }

    public function setId_order($id_order) {
        $this->_id_order= $id_order;
    }

    public function setAmount_total($amount_total) {
        $this->_amount_total= $amount_total;
    }

    public function setAmount_paid($amount_paid) {
        $this->_amount_paid= $amount_paid;
    }

    public function setAmount_remaining($amount_remaining) {
        $this->_amount_remaining= $amount_remaining;
    }

    public function setPayment_method($payment_method) {
        $this->_payment_method= $payment_method;
    }

    //**** Getters *****

    public function getId_payment() {
        return $this->_id_payment;
    }

    public function getDate_created() {
        return $this->_date_created;
    }

    public function getDate_modified() {
        return $this->_date_modified;
    }

    public function getId_order() {
        return $this->_id_order;
    }

    public function getAmount_total() {
        return $this->_amount_total;
    }

    public function getAmount_paid() {
        return $this->_amount_paid;
    }

    public function getAmount_remaining() {
        return $this->_amount_remaining;
    }

    public function getPayment_method() {
        return $this->_payment_method;
    }

    public function delete($id_payment) {
        $requete = "delete from payment where id_payment=" . $id_payment ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
        }
        if ($this->_id_order > 0) {
            $requete = "update payment set date_created='" . ($this->_date_created) . "'";
            $requete .= ",date_modified='" . $this->_date_modified . "',";
            $requete .= ",id_order='" . $this->_id_order . "',";
            $requete .= ",amount_total='" . $this->_amount_total . "',";
            $requete .= ",amount_paid='" . $this->_amount_paid . "',";
            $requete .= ",amount_remaining='" . $this->_amount_remaining . "',";
            $requete .= ",payment_method='" . $this->_payment_method . "'";
            $requete .= " where id_payment=" . $this->_id_payment;

        } else {
            $requete = "INSERT INTO PAYMENT (";
            $requete .= "id_payment,";
            $requete .= "date_created,";
            $requete .= "date_modified,";
            $requete .= "id_order,";
            $requete .= "amount_total,";
            $requete .= "amount_paid,";
            $requete .= "amount_remaining,";
            $requete .= "payment_method";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_payment . "',";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_date_modified . "',";
            $requete .= "'" . $this->_id_order . "',";
            $requete .= "'" . $this->_amount_total . "',";
            $requete .= "'" . $this->_amount_paid . "',";
            $requete .= "'" . $this->_amount_remaining . "',";
            $requete .= "'" . $this->_payment_method . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $PAYMENT = new payment();
        $payment->_id_payment = $rs->fields["id_payment"];
        $payment->_date_created = $rs->fields["date_created"];
        $payment->_date_modified = $rs->fields["date_modified"];
        $payment->_id_order = $rs->fields["id_order"];
        $payment->_amount_total = $rs->fields["amount_total"];
        $payment->_amount_paid = $rs->fields["amount_paid"];
        $payment->_amount_remaining = $rs->fields["amount_remaining"];
        $payment->_payment_method = $rs->fields["payment_method"];
        return $PAYMENT;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listPAYMENT =	 array();
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
        $requete = self::$SELECT . " WHERE id_payment=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }

} 