<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:23
 */

/*
 CREATE TABLE `info_client` (
  `id_client` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `id_user` int(10) NOT NULL,
  `address1` varchar(500) NOT NULL,
  `address2` varchar(500) NOT NULL,
  `dept` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

// Indexes for table `info_client`

/* ALTER TABLE `info_client`
  ADD PRIMARY KEY (`id_client`,`id_user`);
*/

/**************************************/
class info_client {
//**** Variables declarations ****
    private $_id_client = null;
    private $_name = null;
    private $_surname = null;
    private $_id_user = null;
    private $_address1 = null;
    private $_address2 = null;
    private $_dept = null;
    private $_date_created = null;
    private $_date_modified = null;

    private static $SELECT = "SELECT id_client,name,surname, id_user,address1, address2, dept, TO_CHAR(DATE_CREATION,'DD/MM/RRRR HH24:MI:SS') as date_created,TO_CHAR(DATE_CREATION,'DD/MM/RRRR HH24:MI:SS') as date_modified  FROM INFO_CLIENT ";


    //**** Constructeur ****
    private $conn;

    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
}

    //**** Setters *****
    public function setId_client($id_client) {
    $this->_id_client= $id_client;
}

    public function setName($name){
    $this->_name= $name;
}

    public function setSurname($surname){
    $this->_surname= $surname;
}

    public function setId_user($id_user)
{
    $this->_id_user= $id_user;
}

    public function setAddress1($address1)
{
    $this->_address1= $address1;
}

    public function setAddress2($address2)
{
    $this->_address2= $address2;
}

        public function setDept($dept)
{
    $this->_dept= $dept;
}

    public function setDate_created($date_created)
{
    $this->_date_created= $date_created;
}

    public function setDate_modified($date_modified)
{
    $this->_date_modified= $date_modified;
}

    //**** Getters *****

    public function getId_client() {
    return $this->_id_client;
}

    public function getName(){
    return $this->_name;
}

    public function getSurname(){
    return $this->_surname;
}

    public function getId_user(){
    return $this->_id_user;
}

    public function getAddress1(){
    return $this->_address1;
}

        public function getAddress2(){
    return $this->_address2;
}

    public function getDept(){
    return $this->_dept;
}

    public function getDateCreated(){
    return $this->_date_created;
}

    public function getDateModified(){
    return $this->_date_modified;
}

    //**** Fonction de suppression ****
    public function delete($id_client) {
        $requete = "delete from info_client where id_client=" . $id_client;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save() {
        $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
        }
        if ($this->_id_client > 0) {
            $requete = "update info_client set surname='" . ($this->_surname) . "'";
            $requete .= ",name='" . $this->_name . "',";
            $requete .= ",id_user=" . $this->_id_user . "',";
            $requete .= ",address1='" . $this->_address1 . "',";
            $requete .= ",address2='" . $this->_address2 . "',";
            $requete .= ",dept='" . $this->_dept . "',";
            $requete .= ",date_created='" . $this->_date_created . "',";
            $requete .= ",date_modified='" . $this->_date_modified . "',";
            $requete .= " where id_client=" . $this->_id_client;

        } else {
            $requete = "insert into info_client (";
            $requete .= "surname,";
            $requete .= "name,";
            $requete .= "id_user,";
            $requete .= "address1,";
            $requete .= "address2,";
            $requete .= "dept,";
            $requete .= "date_created,";
            $requete .= "date_modified";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_surname . "',";
            $requete .= "'" . $this->_name . "',";
            $requete .= "'" . $this->_id_user . ",";
            $requete .= "'" . $this->_address1 . ",";
            $requete .= "'" . $this->_address2 . ",";
            $requete .= "'" . $this->_dept . ",";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_date_modified . "')";

        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }

    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $info = new info_client();
        $info->_id_user = $rs->fields["id_user"];
        $info->_surname = $rs->fields["surname"];
        $info->_name = $rs->fields["name"];
        $info->_address1 = $rs->fields["address1"];
        $info->_address2 = $rs->fields["address2"];
        $info->_dept = $rs->fields["dept"];
        $info->_date_modified = $rs->fields["date_modified"];
        $info->_date_created = $rs->fields["date_created"];
        return $info;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listInfo = array();
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
        $requete = self::$SELECT . " WHERE id_client=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }

} 