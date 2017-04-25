<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */
/*

-- Table structure for table `log`
--

CREATE TABLE `log` (
`id_log` int(10) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(500) NOT NULL,
  `module` varchar(500) NOT NULL,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id_log`);

-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `id_log` int(10) NOT NULL AUTO_INCREMENT;
 */

class log {
    //**** Variables declarations ****
    private $_id_log = null;
    private $_date_created = null;
    private $_description = null;
    private $_module = null;
    private $_created_by = null;

   private static $SELECT="SELECT * FROM log";
    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId_log($id_log) {
        $this->_id_log= $id_log;
    }

    public function setDate_created($date_created) {
        $this->_date_created= $date_created;
    }

    public function setDescription($description) {
        $this->_description= $description;
    }

    public function setModule($module) {
        $this->_module= $module;
    }

    public function setCreated_by($created_by) {
        $this->_created_by= $created_by;
    }

    //**** Getters *****

    public function getId_log() {
        return $this->_id_log;
    }

    public function getDate_created() {
        return $this->_date_created;
    }

    public function getDescription() {
        return $this->_description;
    }

    public function getModule() {
        return $this->_module;
    }

    public function getCreated_by() {
        return $this->_created_by;
    }

    public function delete($id_log) {
        $requete = "DELETE FROM log WHERE id_log=" . $id_log ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        // $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
        }
        if ($this->_id_log > 0) {
            $requete = "update log set date_created='" . ($this->_date_created) . "'";
            $requete .= ",description='" . $this->_description . "',";
            $requete .= ",module='" . $this->_module . "',";
            $requete .= ",created_by='" . $this->_created_by . "',";
            $requete .= " where id_log=" . $this->_id_log;

        } else {
            $requete = "insert into log (";
            $requete .= "id_log,";
            $requete .= "date_created,";
            $requete .= "description,";
            $requete .= "module,";
            $requete .= "created_by";
            $requete .= ") values (";
            $requete .= "'" . $this->_id_log . "',";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_description . "',";
            $requete .= "'" . $this->_module . "',";
            $requete .= "'" . $this->_created_by . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $log = new log();
        $log->_id_log = $rs->fields["id_log"];
        $log->_date_created = $rs->fields["date_created"];
        $log->_description = $rs->fields["description"];
        $log->_module = $rs->fields["module"];
        $log->_created_by = $rs->fields["created_by"];
        return $log;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listLOG =	 array();
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
        $requete = self::$SELECT . " WHERE id_log=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }




} 