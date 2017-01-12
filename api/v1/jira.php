<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:48
 */

/*
 * --
-- Table structure for table `unknown`
--

CREATE TABLE `jira` (
  `id_jira` int(10) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_filled` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(500) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `jira`
  ADD PRIMARY KEY (`id_jira `);


-- AUTO_INCREMENT for table `unknown`
--
ALTER TABLE `jira`
  MODIFY `id_jira` int(10) NOT NULL AUTO_INCREMENT;
 */

class jira {
    //**** Variables declarations ****
    private $_id_jira = null;
    private $_date_created = null;
    private $_date_filled = null;
    private $_description = null;
    private $_status = null;


    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    private static $SELECT="SELECT * FROM JIRA";

    //**** Setters *****
    public function setId_jira($id_jira) {
        $this->_id_jira= $id_jira;
    }

    public function setDate_created($date_created) {
        $this->_date_created= $date_created;
    }

    public function setDate_filled($date_filled) {
        $this->_date_filled= $date_filled;
    }

    public function setDescription($description) {
        $this->_description= $description;
    }

    public function setStatus($status) {
        $this->_status= $status;
    }


    //**** Getters *****

    public function getId_jira() {
        return $this->_id_jira;
    }

    public function getDate_created() {
        return $this->_date_created;
    }

    public function getDate_filled() {
        return $this->_date_filled;
    }

    public function getDescription() {
        return $this->_description;
    }

    public function getStatus() {
        return $this->_status;
    }


    public function delete($id_jira) {
        $requete = "DELETE FROM jira WHERE id_jira=" . $id_jira ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        // $this->_date_filled = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created= date('Y/m/d H:i:s', time());
        }
        if ($this->_id_jira > 0) {
            $requete = "update jira set date_created='" . ($this->_date_created) . "'";
            $requete .= ",date_filled='" . $this->_date_filled . "',";
            $requete .= ",description='" . $this->_description . "',";
            $requete .= ",status='" . $this->_status . "'";
            $requete .= " where id_jira=" . $this->_id_jira;

        } else {
            $requete = "INSERT INTO JIRA (";
            $requete .= "id_jira,";
            $requete .= "date_created,";
            $requete .= "date_filled,";
            $requete .= "description,";
            $requete .= "status";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_jira . "',";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_date_filled . "',";
            $requete .= "'" . $this->_description . "',";
            $requete .= "'" . $this->_status . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $jir = new jira();
        $jir->_id_jira = $rs->fields["id_jira"];
        $jir->_date_created = $rs->fields["date_created"];
        $jir->_date_filled = $rs->fields["date_filled"];
        $jir->_description = $rs->fields["description"];
        $jir->_status = $rs->fields["status"];
        return $jir;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listjira = array();
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
        $requete = self::$SELECT . " WHERE id_jira=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }


} 