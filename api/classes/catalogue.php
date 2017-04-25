<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:05
 */

/*--
-- Table structure for table `catalogue`
--

CREATE TABLE `catalogue` (
`id_catalogue` int(10) NOT NULL,
  `id_client` int(10) NOT NULL,
  `id_marketer` int(10) NOT NULL,
  `link` varchar(10) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `modified_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `catalogue`
  ADD PRIMARY KEY (`id_catalogue`);
**/

class catalogue {
//**** Variables declarations ****
    private $_id_catalogue = null;
    private $_id_client = null;
    private $_id_marketer = null;
    private $_link = null;
    private $_description = null;
    private $_date_created = null;
    private $_date_modified = null;
    private $_created_by = null;
    private $_modified_by = null;

    private static $SELECT = "SELECT * FROM catalogue";

    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId_catalogue($id_catalogue) {
        $this->_id_catalogue= $id_catalogue;
    }

    public function setId_client($id_client) {
        $this->_id_client= $id_client;
    }

    public function setId_marketer($id_marketer) {
        $this->_id_marketer= $id_marketer;
    }

    public function setLink($link) {
        $this->_link= $link;
    }

    public function setDescription($description) {
        $this->_description= $description;
    }

    public function setDate_created($date_created) {
        $this->_date_created= $date_created;
    }

    public function setDate_modified($date_modified) {
        $this->_date_modified= $date_modified;
    }

    public function setCreated_by($created_by) {
        $this->_created_by= $created_by;
    }

    public function setModified_by($modified_by) {
        $this->_modified_by= $modified_by;
    }

    //**** Getters *****

    public function getId_catalogue() {
        return $this->_id_catalogue;
    }


    public function getId_client() {
        return $this->_id_client;
    }

    public function getId_marketer() {
        return $this->_id_marketer;
    }

    public function getLink() {
        return $this->_link;
    }

    public function getDescription() {
        return $this->_description;
    }

    public function getDate_created() {
        return $this->_date_created;
    }

    public function getDate_modified() {
        return $this->_date_modified;
    }

    public function getCreated_by() {
        return $this->_created_by;
    }

    public function getModified_by() {
        return $this->_modified_by;
    }

    public function delete($id_catalogue) {
        $requete = "DELETE FROM catalogue WHERE id_catalogue=" . $id_catalogue;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_date_created == null) {
            $this->_date_created = date('Y/m/d H:i:s', time());
        }
        if ($this->_id_catalogue > 0) {
            $requete = "UPDATE CATALOGUE SET id_client='" . ($this->_id_client) . "'";
            $requete .= ",id_marketer='" . $this->_id_marketer . "',";
            $requete .= ",link='" . $this->_link . "',";
            $requete .= ",description='" . $this->_description . "',";
            $requete .= ",date_created='" . $this->_date_created . "',";
            $requete .= ",date_modified='" . $this->_date_modified . "',";
            $requete .= ",created_by='" . $this->_created_by . "',";
            $requete .= ",modified_by='" . $this->_modified_by . "'";
            $requete .= " WHERE id_catalogue=" . $this->_id_catalogue;

        } else {
            $requete = "INSERT INTO catalogue (";
            $requete .= "id_catalogue,";
            $requete .= "id_client,";
            $requete .= "id_marketer,";
            $requete .= "link,";
            $requete .= "description,";
            $requete .= "date_created,";
            $requete .= "date_modified,";
            $requete .= "created_by,";
            $requete .= "modified_by";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_catalogue . "',";
            $requete .= "'" . $this->_id_client . "',";
            $requete .= "'" . $this->_id_marketer . "',";
            $requete .= "'" . $this->_link . ",";
            $requete .= "'" . $this->_description. ",";
            $requete .= "'" . $this->_date_created . ",";
            $requete .= "'" . $this->_date_modified . ",";
            $requete .= "'" . $this->_created_by . "',";
            $requete .= "'" . $this->_modified_by . "')";

        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $catalogue = new catalogue();
        $catalogue->_id_catalogue = $rs->fields["id_catalogue"];
        $catalogue->_id_client = $rs->fields["id_client"];
        $catalogue->_id_marketer = $rs->fields["ID_MARKETER"];
        $catalogue->_link = $rs->fields["LINK"];
        $catalogue->_description = $rs->fields["DESCRIPTION"];
        $catalogue->_date_created = $rs->fields["DATE_CREATED"];
        $catalogue->_date_modified = $rs->fields["DATE_MODIFIED"];
        $catalogue->_created_by = $rs->fields["CREATED_BY"];
        $catalogue->_modified_by = $rs->fields["MODIFIED_BY"];
        return $catalogue;
    }

    public function rechercher() { // Recherche de toutes les adresses
        $listcatalogue = array();
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
        $requete = self::$SELECT . " WHERE ID_CATALOGUE=" . $key;
        $rs = $this->conn->query($requete);
        if ($rs->EOF) {
            return null;
        }
        return $this->mapSqlToObject($rs);
    }
} 