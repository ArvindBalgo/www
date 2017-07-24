<?php

/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:43
 */
class cata_image
{
    //**** Variables declarations ****
    private $_id = null;
    private $_id_category = null;
    private $_libelle = '';
    private $_src = '';
    private $_display_src = '';
    private $_reference = '';
    private $_active = null;

    private static $SELECT = "SELECT * FROM cata_image";

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

    public function setIdCategory($id)
    {
        $this->_id_category = $id;
    }

    public function setLibelle($libelle)
    {
        $this->_libelle = $libelle;
    }

    public function setSrc($src)
    {
        $this->_src = $src;
    }

    public function setDisplaySrc($src)
    {
        $this->_display_src = $src;
    }

    public function setReference($ref)
    {
        $this->_reference = $ref;
    }

    public function setActive($active)
    {
        $this->_active = $active;
    }

    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getIdCategory()
    {
        return $this->_id_category;
    }

    public function getLibelle()
    {
        return $this->_libelle;
    }


    public function getSrc()
    {
        return $this->_src;
    }

    public function getDisplaySrc()
    {
        return $this->_display_src;
    }

    public function getReference()
    {
        return $this->_reference;
    }

    public function getActive()
    {
        return $this->_active;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM cata_image WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE cata_image SET libelle='" . ($this->_libelle) . "'";
            $requete .= ",id_category='" . $this->_id_category . "'";
            $requete .= ",src='" . $this->_src . "'";
            $requete .= ",display_src='" . $this->_display_src . "'";
            $requete .= ",reference='" . $this->_reference . "'";
            $requete .= ",active=" . $this->_active;
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO cata_image (";
            $requete .= "libelle,";
            $requete .= "display_src,";
            $requete .= "src,";
            $requete .= "reference,";
            $requete .= "id_category,";
            $requete .= "active";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_libelle . "',";
            $requete .= "'" . $this->_display_src . "',";
            $requete .= "'" . $this->_src . "',";
            $requete .= "'" . $this->_reference . "',";
            $requete .= "'" . $this->_id_category . "',";
            $requete .= "'" . $this->_active . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $cata_image = new cata_image();
        $cata_image->_id = $rs["id"];
        $cata_image->_id_category = $rs["id_category"];
        $cata_image->_libelle = $rs["libelle"];
        $cata_image->_src = $rs["src"];
        $cata_image->_display_src = $rs["display_src"];
        $cata_image->_reference = $rs["reference"];
        $cata_image->_active = $rs["active"];
        return $cata_image;
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

    public function findInfoImage()
    {
        //Requete pour recuperer tous les category pour images
        $requete = "select * from cata_category where active = 1";
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $data = $row;
            //$rows[] = $row;
            $data = [];

            $requete = "select * from cata_image where id_category=" . $row["id"];
            $query = $this->conn->query($requete) or die($this->conn->error . __LINE__);

            while ($ligne = mysqli_fetch_array($query)) {
                $data[] = $ligne;
            }

            $row["data"] = $data;

            $rows[] = $row;
        }
        return $rows;
    }
}
