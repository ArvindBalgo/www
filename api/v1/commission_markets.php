<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:21
 */

/*
 * --
-- Table structure for table `commission_markets`
--

CREATE TABLE `commission_markets` (
  `id_comm` int(10) NOT NULL,
  `id_marketer` int(10) NOT NULL,
  `id_order` int(10) NOT NULL,
  `percentage` float NOT NULL,
  `amount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- AUTO_INCREMENT for table `commission_markets`
--
ALTER TABLE `commission_markets`
  MODIFY `id_comm` int(10) NOT NULL AUTO_INCREMENT;
--
 */

class commission_markets {
    //**** Variables declarations ****
    private $_id_comm = null;
    private $_id_marketer = null;
    private $_id_order = null;
    private $_percentage = null;
    private $_amount = null;

    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    private static $SELECT="SELECT * FROM COMMISSION_MARKETS";
    //**** Setters *****
    public function setId_comm($id_comm) {
        $this->_id_comm= $id_comm;
    }

    public function setId_marketer($id_marketer) {
        $this->_id_marketer= $id_marketer;
    }

    public function setId_order($id_order) {
        $this->_id_order= $id_order;
    }

    public function setPercentage($percentage) {
        $this->_percentage= $percentage;
    }

    public function setAmount($amount) {
        $this->_amount= $amount;
    }

    //**** Getters *****

    public function getId_comm() {
        return $this->_id_comm;
    }


    public function getId_marketer() {
        return $this->_id_marketer;
    }


    public function getId_order() {
        return $this->_id_order;
    }

    public function getPercentage() {
        return $this->_percentage;
    }

    public function getAmount() {
        return $this->_amount;
    }

    public function delete($id_comm) {
        $requete = "DELETE FROM COMMISSION_MARKETS WHERE id_comm=" . $id_comm ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
       /* $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
        }*/
        if ($this->_id_comm > 0) {
            $requete = "UPDATE COMMISSION_MARKETS SET ID_MARKETER='" . ($this->_id_marketer) . "'";
            $requete .= ",ID_ORDER='" . $this->_id_order . "',";
            $requete .= ",PERCENTAGE='" . $this->_percentage . "',";
            $requete .= ",AMOUNT='" . $this->_amount . "'";
            $requete .= " WHERE ID_COMM=" . $this->_id_comm;

        } else {
            $requete = "INSERT INTO COMMISSION_MARKETS (";
            $requete .= "ID_COMM,";
            $requete .= "ID_MARKETER,";
            $requete .= "ID_ORDER,";
            $requete .= "PERCENTAGE,";
            $requete .= "AMOUNT";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_comm . "',";
            $requete .= "'" . $this->_id_marketer . "',";
            $requete .= "'" . $this->_id_order . "',";
            $requete .= "'" . $this->_percentage . "',";
            $requete .= "'" . $this->_amount . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $COMMISSION = new commission_markets();
        $COMMISSION->_id_comm = $rs->fields["ID_COMM"];
        $COMMISSION->_id_marketer = $rs->fields["ID_MARKETER"];
        $COMMISSION->_id_order = $rs->fields["ID_ORDER"];
        $COMMISSION->_percentage = $rs->fields["PERCENTAGE"];
        $COMMISSION->_amount = $rs->fields["AMOUNT"];
        return $COMMISSION;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listCOMMISION_MARKETS = array();
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
        $requete = self::$SELECT . " WHERE ID_COMM=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }


} 