<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */

/*
 * CREATE TABLE `commande_ligne_params` (
  `id` int(11) NOT NULL,
  `id_comm_ligne` int(11) NOT NULL,
  `src` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `title` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `type` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `params` mediumtext COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `commande_ligne_params`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commande_ligne_params`
--
ALTER TABLE `commande_ligne_params`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION  */
class commande_ligne_params {
    //**** Variables declarations ****
    private $_id = null;
    private $_id_comm_ligne = null;
    private $_title = null;
    private $_src = null;
    private $_type = null;
    private $_params = null;

   private static $SELECT="SELECT * FROM commande_ligne_params";
    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId($id) {
        $this->_id= $id;
    }
    public function setIdCommLigne($id) {
        $this->_id_comm_ligne= $id;
    }

    public function setTitle($title) {
        $this->_title= $title;
    }

    public function setSrc($src) {
        $this->_src= $src;
    }

    public function setType($type) {
        $this->_type= $type;
    }

    public function setParams($params) {
        $this->_params= $params;
    }
    //**** Getters *****

    public function getId() {
        return $this->_id;
    }

    public function getIdCataLigne() {
        return $this->_id_cata_ligne;
    }

    public function getSrc() {
        return $this->_src;
    }


    public function getTitle() {
        return $this->_title;
    }

    public function getType() {
        return $this->_type;
    }

    public function getParams() {
        return $this->_params;
    }

    public function delete($id) {
        $requete = "DELETE FROM commande_ligne_params WHERE id=" . $id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }

    public function delByIdCataLigne($id) {
        $requete = "DELETE FROM commande_ligne_params WHERE id_comm_ligne=".$id;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {

        if ($this->_id > 0) {
            $requete = "UPDATE commande_ligne_params SET title='" . ($this->_title) . "'";
            $requete .= ",src='" . $this->_src . "'";
            $requete .= ",id_comm_ligne='" . $this->_id_comm_ligne . "'";
            $requete .= ",type='" . $this->_type . "'";
            $requete .= ",params='" . $this->_params . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO commande_ligne_params (";
            $requete .= "title,";
            $requete .= "src,";
            $requete .= "id_comm_ligne,";
            $requete .= "type,";
            $requete .= "params";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . $this->_src . "',";
            $requete .= "'" . $this->_id_comm_ligne . "',";
            $requete .= "'" . $this->_type . "',";
            $requete .= "'" . $this->_params . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $commande_ligne_params = new commande_ligne_params();
        $commande_ligne_params->_id = $rs["id"];
        $commande_ligne_params->_title = $rs["title"];
        $commande_ligne_params->_src = $rs["src"];
        $commande_ligne_params->_id_comm_ligne = $rs["id_comm_ligne"];
        $commande_ligne_params->_type = $rs["type"];
        $commande_ligne_params->_params = $rs["params"];
        return $commande_ligne_params;
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
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function getLastId(){
        $requete = "SELECT MAX(id) AS id FROM commande_ligne_params";
        $rs = $this->conn->query($requete);
        $result = mysqli_fetch_array($rs);
        return $result["id"];
    }

    public function findByIdComm($id){
        $requete = "select * from commande_ligne_params where id_comm_ligne=".$id;
        $rs = $this->conn->query($requete);
        $rows = [];
        while($row = mysqli_fetch_array($rs))
        {
            //$rows[] = array("id_comm_ligne"=>$rs["id_comm_ligne"], "params"=>unserialize($rs["params"]), "src"=>$rs["src"] , "title" => $rs["title"] , "type" => $rs["type"]);
            array_push($rows,array("id_comm_ligne"=>$row["id_comm_ligne"], "parameters"=>(unserialize($row["params"])), "source"=>$row["src"] , "title" => $row["title"] , "type" => $row["type"]) );
        }

        return $rows;
    }

} 