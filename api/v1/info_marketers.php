<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:25
 */

/* --
-- Table structure for table `info_marketers`
--

CREATE TABLE `info_marketers` (
`id_marketers` int(10) NOT NULL,
  `surname` varchar(500) NOT NULL,
  `name` varchar(500) NOT NULL,
  `address1` varchar(500) NOT NULL,
  `address2` varchar(500) NOT NULL,
  `assigned_dept` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- AUTO_INCREMENT for table `info_marketers`
--
ALTER TABLE `info_marketers`
  MODIFY `id_marketers` int(10) NOT NULL AUTO_INCREMENT;
*/

class info_marketers {
    //**** Variables declarations ****
    private $_id_marketers = null;
    private $_surname = null;
    private $_name = null;
    private $_address1 = null;
    private $_address2 = null;
    private $_assigned_dept = null;

    //**** Constructeur ****
    public function __construct() {
        parent::__construct();
    }

    private static $SELECT="SELECT * FROM info_marketers";
    //**** Setters *****
    public function setId_marketers($id_marketers) {
        $this->_id_marketers= $id_marketers;
    }

    public function setSurname($surname) {
        $this->_surname= $surname;
    }

    public function setName($name) {
        $this->_name= $name;
    }

    public function setAddress1($address1) {
        $this->_address1= $address1;
    }

    public function setAddress2($address2) {
        $this->_address2= $address2;
    }

    public function setAssigned_dept($assigned_dept) {
        $this->_assigned_dept= $assigned_dept;
    }

    //**** Getters *****

    public function getId_marketers() {
        return $this->_id_marketers;
    }

    public function getSurname() {
        return $this->_surname;
    }

    public function getName() {
        return $this->_name;
    }

    public function getAddress1() {
        return $this->_address1;
    }

    public function getAddress2() {
        return $this->_address2;
    }

    public function getAssigned_dept() {
        return $this->_assigned_dept;
    }

    public function delete($id_marketers) {
        $requete = "delete from info_marketers where id_marketers=" . $id_marketers ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        // $this->_date_modified = date('Y/m/d H:i:s', time());
        /* if ($this->_created == null) {
             $this->_created = date('Y/m/d H:i:s', time());
         }*/
        if ($this->_id_marketers > 0) {
            $requete = "update info_marketers set surname='" . ($this->_surname) . "'";
            $requete .= ",name='" . $this->_name . "',";
            $requete .= ",address1='" . $this->_address1 . "',";
            $requete .= ",address2='" . $this->_address2 . "',";
            $requete .= ",assigned_dept='" . $this->_assigned_dept . "'";
            $requete .= " where id_marketers=" . $this->_id_marketers;

        } else {
            $requete = "insert into info_marketers (";
            $requete .= "id_marketers,";
            $requete .= "surname,";
            $requete .= "name,";
            $requete .= "address1,";
            $requete .= "address2,";
            $requete .= "assigned_dept";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_marketers . "',";
            $requete .= "'" . $this->_surname . "',";
            $requete .= "'" . $this->_name . "',";
            $requete .= "'" . $this->_address1 . "',";
            $requete .= "'" . $this->_address2 . "',";
            $requete .= "'" . $this->_assigned_dept . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $info_market = new info_marketers();
        $info_market->_id_marketers = $rs->fields["id_marketers"];
        $info_market->_surname = $rs->fields["surname"];
        $info_market->_name = $rs->fields["name"];
        $info_market->_address1 = $rs->fields["address1"];
        $info_market->_address2 = $rs->fields["address2"];
        $info_market->_assigned_dept = $rs->fields["assigned_dept"];
        return $info_market;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listinfo_market = array();
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
        $requete = self::$SELECT . " WHERE id_marketers=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }


} 