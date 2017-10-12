<?php

class custom_salesman
{
    //**** Variables declarations ****
    private $_id = null;
    private $_title = "";
    private $_image_src = "";
    private $_id_cata = 0;
    private $_id_front = 0;
    private $_id_back = 0;
    private $_id_salesman = 0;
    private $_data = 0;

    private static $SELECT = "SELECT * FROM custom_salesman";

    //**** Constructeur ****
    public function __construct()
    {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setId($id)
    {
        $this->_id = $id;
    }

    public function setTitle($val)
    {
        $this->_title = $val;
    }

    public function setImageSrc($val)
    {
        $this->_image_src = $val;
    }

    public function setIdCata($val)
    {
        $this->_id_cata = $val;
    }

    public function setIdFront($val)
    {
        $this->_id_front = $val;
    }

    public function setIdBack($val)
    {
        $this->_id_back = $val;
    }

    public function setIdSalesman($val)
    {
        $this->_id_salesman = $val;
    }

    public function setData($val)
    {
        $this->_data = $val;
    }

    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getTitle()
    {
        return $this->_title;
    }

    public function getImageSrc()
    {
        return $this->_image_src;
    }

    public function getIdCata()
    {
        return $this->_id_cata;
    }

    public function getIdBack()
    {
        return $this->_id_back;
    }

    public function getIdFront()
    {
        return $this->_id_front;
    }

    public function getIdSalesman()
    {
        return $this->_id_salesman;
    }

    public function getData()
    {
        return $this->_data;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM custom_salesman WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/création *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE custom_salesman SET id_cata='" . ($this->_id_cata) . "'";
            $requete .= ", title='" . $this->_title . "'";
            $requete .= ", image_src='" . $this->_image_src. "'";
            $requete .= ", id_front=" . $this->_id_front;
            $requete .= ", id_back=" . $this->_id_back;
            $requete .= ", id_salesman=" . $this->_id_salesman;
            $requete .= ", data='" . addslashes(json_encode($this->_data) ) . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO custom_salesman (";
            $requete .= "id_cata";
            $requete .= ",title";
            $requete .= ",image_src";
            $requete .= ",id_front";
            $requete .= ",id_back";
            $requete .= ",id_salesman";
            $requete .= ",data";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_cata . "',";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . $this->_image_src. "',";
            $requete .= "'" . $this->_id_front . "',";
            $requete .= "'" . $this->_id_back . "',";
            $requete .= "'" . $this->_id_salesman . "',";
            $requete .= "'" . addslashes(json_encode($this->_data)) . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $custom_salesman = new custom_salesman();
        $custom_salesman->_id = $rs["id"];
        $custom_salesman->_title = $rs["title"];
        $custom_salesman->_image_src= $rs["image_src"];
        $custom_salesman->_id_cata = $rs["id_cata"];
        $custom_salesman->_id_front = $rs["id_front"];
        $custom_salesman->_id_back = $rs["id_back"];
        $custom_salesman->_id_salesman = $rs["id_salesman"];
        $custom_salesman->_data = $rs["data"];
        return $custom_salesman;
    }

    public function rechercher()
    { // Recherche de toutes les adresses
        $listLOG = array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function rechSalesman($id)
    { // Recherche de toutes les adresses
        $listLOG = array();
        $requete = self::$SELECT . " where id_salesman =" . $id;
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByPrimaryKey($key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
}