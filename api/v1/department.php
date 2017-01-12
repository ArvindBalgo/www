<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:22
 */
/*-- Table structure for table `department`
--

CREATE TABLE `department` (
`id_dept` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `department`
  MODIFY `id_dept` int(10) NOT NULL AUTO_INCREMENT;
*/

class department {
    //**** Variables declarations ****
    private $_id_dept = null;
    private $_name = null;
    private $_description = null;

    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    private static $SELECT="SELECT * FROM department";
    //**** Setters *****
    public function setId_dept($id_dept) {
        $this->_id_dept= $id_dept;
    }

    public function setName($name) {
        $this->_name= $name;
    }

    public function setDescription($description) {
        $this->_description= $description;
    }

    //**** Getters *****

    public function getId_dept() {
        return $this->_id_dept;
    }


    public function getName() {
        return $this->_name;
    }

    public function getDescription() {
        return $this->_description;
    }

    public function delete($id_dept) {
        $requete = "DELETE FROM department WHERE id_dept=" . $id_dept ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        // $this->_date_modified = date('Y/m/d H:i:s', time());
        /* if ($this->_created == null) {
             $this->_created = date('Y/m/d H:i:s', time());
         }*/
        if ($this->_id_dept > 0) {
            $requete = "UPDATE department SET name='" . ($this->_name) . "'";
            $requete .= ",description='" . $this->_description . "'";
            $requete .= " WHERE id_dept=" . $this->_id_dept;

        } else {
            $requete = "INSERT INTO department (";
            $requete .= "id_dept,";
            $requete .= "name,";
            $requete .= "description,";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_dept . "',";
            $requete .= "'" . $this->_name . "',";
            $requete .= "'" . $this->_description . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $dept = new department();
        $dept->_id_dept= $rs->fields["id_dept"];
        $dept->_name = $rs->fields["name"];
        $dept->_description = $rs->fields["description"];
        return $dept;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listdept = array();
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
        $requete = self::$SELECT . " WHERE id_dept=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }


} 