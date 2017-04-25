<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:45
 */
/*
 * --
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id_order` int(10) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_client` int(10) NOT NULL,
  `id_marketer` int(10) NOT NULL,
  `id_catalogue` int(10) NOT NULL,
  `qty` int(6) NOT NULL,
  `price` float NOT NULL,
  `delivery_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(500) NOT NULL,
  `modified_by` varchar(500) NOT NULL,
  `discount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`);

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id_order` int(10) NOT NULL AUTO_INCREMENT;
 */


class orders {
    //**** Variables declarations ****
    private $_id_order = null;
    private $_date_created = null;
    private $_date_modified = null;
    private $_id_client = null;
    private $_id_marketer = null;
    private $_id_catalogue = null;
    private $_qty = null;
    private $_price = null;
    private $_delivery_date = null;
    private $_created_by = null;
    private $_modified_by = null;
    private $_discount = null;

    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    private static $SELECT="SELECT * FROM ORDERS";

    //**** Setters *****
    public function setId_order($id_order) {
        $this->_id_order= $id_order;
    }

    public function setDate_created($date_created) {
        $this->_date_created= $date_created;
    }

    public function setDate_modified($date_modified) {
        $this->_date_modified= $date_modified;
    }

    public function setId_client($id_client) {
        $this->_id_client= $id_client;
    }

    public function setId_marketer($id_marketer) {
        $this->_id_marketer= $id_marketer;
    }

    public function setId_catalogue($id_catalogue) {
        $this->_id_catalogue= $id_catalogue;
    }

    public function setQty($qty) {
        $this->_qty= $qty;
    }

    public function setPrice($price) {
        $this->_price= $price;
    }

    public function setDelivery_date($delivery_date) {
        $this->_delivery_date= $delivery_date;
    }

    public function setCreated_by($created_by) {
        $this->_created_by= $created_by;
    }

    public function setModified_by($modified_by) {
        $this->_modified_by= $modified_by;
    }

    public function setDiscount($discount) {
        $this->_discount= $discount;
    }

    public function delete($id_order) {
        $requete = "DELETE FROM ORDERS WHERE id_order=" . $id_order ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
        }
        if ($this->_id_order > 0) {
            $requete = "UPDATE ORDERS SET DATE_CREATED='" . ($this->_date_created) . "'";
            $requete .= ",DATE_MODIFIED='" . $this->_date_modified . "',";
            $requete .= ",ID_CLIENT='" . $this->_id_client . "',";
            $requete .= ",ID_MARKETER='" . $this->_id_marketer . "',";
            $requete .= ",ID_CATALOGUE='" . $this->_id_catalogue . "',";
            $requete .= ",QTY='" . $this->_qty . "',";
            $requete .= ",PRICE='" . $this->_price . "',";
            $requete .= ",DELIVERY_DATE='" . $this->_delivery_date . "',";
            $requete .= ",CREATED_BY='" . $this->_created_by . "',";
            $requete .= ",MODIFIED_BY='" . $this->_modified_by . "',";
            $requete .= ",DISCOUNT='" . $this->_discount . "'";
            $requete .= " WHERE ID_ORDER=" . $this->_id_order;

        } else {
            $requete = "INSERT INTO ORDERS (";
            $requete .= "ID_ORDER,";
            $requete .= "DATE_CREATED,";
            $requete .= "DATE_MODIFIED,";
            $requete .= "ID_CLIENT,";
            $requete .= "ID_MARKETER,";
            $requete .= "ID_CATALOGUE,";
            $requete .= "QTY,";
            $requete .= "PRICE,";
            $requete .= "DELIVERY_DATE,";
            $requete .= "CREATED_BY,";
            $requete .= "MODIFIED_BY,";
            $requete .= "DISCOUNT";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_order . "',";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_date_modified . "',";
            $requete .= "'" . $this->_id_client . "',";
            $requete .= "'" . $this->_id_marketer . ",";
            $requete .= "'" . $this->_id_catalogue . "',";
            $requete .= "'" . $this->_qty . "',";
            $requete .= "'" . $this->_price . "',";
            $requete .= "'" . $this->_delivery_date . "',";
            $requete .= "'" . $this->_created_by . "',";
            $requete .= "'" . $this->_modified_by . "',";
            $requete .= "'" . $this->_discount . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $order = new orders();
        $order->_id_order = $rs->fields["ID_ORDER"];
        $order->_date_created = $rs->fields["DATE_CREATED"];
        $order->_date_modified = $rs->fields["DATE_MODIFIED"];
        $order->_id_client = $rs->fields["ID_CLIENT"];
        $order->_id_marketer = $rs->fields["ID_MARKETER"];
        $order->_id_catalogue = $rs->fields["ID_CATALOGUE"];
        $order->_qty = $rs->fields["QTY"];
        $order->_price = $rs->fields["PRICE"];
        $order->_delivery_date= $rs->fields["DELIVERY_DATE"];
        $order->_created_by = $rs->fields["CREATED_BY"];
        $order->_modified_by = $rs->fields["MODIFIED_BY"];
        $order->_discount = $rs->fields["DISCOUNT"];
        return $order;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listorders = array();
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
        $requete = self::$SELECT . " WHERE ID_ORDER=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }

} 