<?php

class youtube_links
{
    //**** Variables declarations ****
    private $_id = null;
    private $_title = "";
    private $_description = "";
    private $_links = "";

    private static $SELECT = "SELECT * FROM youtube_links";

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

    public function setDescription($descrip)
    {
        $this->_description = $descrip;
    }

    public function setyoutubeLink($val)
    {
        $this->_links = $val;
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

    public function getDescription()
    {
        return $this->_description;
    }

    public function getYoutubeLinks()
    {
        return $this->_links;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM youtube_links WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE youtube_links SET description='" . ($this->_description) . "'";
            $requete .= ", title='".($this->_title)."'";
            $requete .= ", links='".($this->_links)."'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO youtube_links (";
            $requete .= "title";
            $requete .= ",description";
            $requete .= ",links";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . $this->_description . "',";
            $requete .= "'" . $this->_links . "')";
        }
        chromePHP::log($requete);
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $youtube = new youtube_links();
        $youtube->_id = $rs["id"];
        $youtube->_title = $rs["title"];
        $youtube->_description = $rs["description"];
        $youtube->_links= $rs["links"];
        return $youtube;
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

    public function findByPrimaryKey($key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
} 