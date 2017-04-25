<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:47
 */
/*
 * --
-- Table structure for table `pics_reference`
--

CREATE TABLE `pics_reference` (
  `id_ref` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `description` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Indexes for table `pics_reference`
--
ALTER TABLE `pics_reference`
  ADD PRIMARY KEY (`id_ref`);


--
-- AUTO_INCREMENT for table `pics_reference`
--
ALTER TABLE `pics_reference`
  MODIFY `id_ref` int(10) NOT NULL AUTO_INCREMENT;
--
 */
class pics_reference {
    //**** Variables declarations ****
    private $_id_ref = null;
    private $_name = null;
    private $_category = null;
    private $_url = null;
    private $_description = null;

    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    private static $SELECT="SELECT * FROM pics_reference";
    //**** Setters *****
    public function setId_ref($id_ref) {
        $this->_id_ref = $id_ref;
    }

    public function setName($name) {
        $this->_name = $name;
    }

    public function setCategory($category) {
        $this->_category = $category;
    }

    public function setUrl($url){
        $this->_url = $url;
    }

    public function setDescription ($description)
    {
        $this->_description = $description;
    }

    //**** Getters *****

    public function getId_ref() {
        return $this->_id_ref;
    }

    public function getName(){
        return $this->_name;
    }

    public function getCategory(){
        return $this->_category;
    }

    public function getUrl(){
        return $this->_url;
    }

    public function getDescription(){
        return $this->_description;
    }

    public function delete($id_ref) {
        $requete = "delete from pics_reference where id_ref=" . $id_ref ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        /* $this->_date_modified = date('Y/m/d H:i:s', time());
          if ($this->_date_created == null) {
             $this->_date_created = date('Y/m/d H:i:s', time());
         }*/
        if ($this->_id_ref > 0) {
            $requete = "update pics_reference set name='" . ($this->_name) . "'";
            $requete .= ",category='" . $this->_category . "',";
            $requete .= ",url='" . $this->_url . "',";
            $requete .= ",description='" . $this->_description . "',";
            $requete .= " where id_ref=" . $this->_id_ref;

        } else {
            $requete = "INSERT INTO pics_reference (";
            $requete .= "id_ref,";
            $requete .= "name,";
            $requete .= "category,";
            $requete .= "url,";
            $requete .= "description";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_ref . "',";
            $requete .= "'" . $this->_name . "',";
            $requete .= "'" . $this->_category . "',";
            $requete .= "'" . $this->_url . "',";
            $requete .= "'" . $this->_description . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $ref  = new id_ref();
        $ref->_id_ref = $rs->fields["id_ref"];
        $ref->_name = $rs->fields["name"];
        $ref->_category = $rs->fields["category"];
        $ref->_url = $rs->fields["url"];
        $ref->_description = $rs->fields["description"];
        return $ref;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listref =	 array();
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
        $requete = self::$SELECT . " WHERE id_ref=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }


} 