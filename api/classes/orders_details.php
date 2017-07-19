<?php

class orders_details
{
    //**** Variables declarations ****
    private $_id = null;
    private $_id_order = 0;
    private $_base64_image = "";
    private $_bonrepli = 0;
    private $_commentaire = "";
    private $_dimension = "";
    private $_id_dimension = 0;
    private $_escargot = 0;
    private $_escargot_val = 0;
    private $_contours = 0;
    private $_liserai = 0;
    private $_opt = 0;
    private $_prix_ht = 0;
    private $_prix_ttc = 0;
    private $_unit_prix = 0;
    private $_prix_livraison_ht = 0;
    private $_prix_livraison_ttc = 0;
    private $_idsupport = 0;
    private $_support = "";
    private $_qte = 0;
    private $_id_qte = 0;
    private $_title = "";
    private $_data = "";
    private $_created_by = "";
    private $_modified_by = "";
    private $_date_created = "";
    private $_date_modified = "";
    private $_flag = "";
    private $_status = "";

    private static $SELECT = "SELECT * FROM orders_details";

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

    public function setIdOrder($val)
    {
        $this->_id_order = $val;
    }


    public function setBase64Image($val)
    {
        $this->_base64_image = $val;
    }


    public function setBonRepli($val)
    {
        $this->_bonrepli = $val;
    }


    public function setCommentaire($val)
    {
        $this->_commentaire = $val;
    }


    public function setDimension($val)
    {
        $this->_dimension = $val;
    }


    public function setIdDimension($val)
    {
        $this->_id_dimension = $val;
    }


    public function setEscargot($val)
    {
        $this->_escargot = $val;
    }


    public function setEscargotVal($val)
    {
        $this->_escargot_val = $val;
    }


    public function setContours($val)
    {
        $this->_contours = $val;
    }


    public function setLiserai($val)
    {
        $this->_liserai = $val;
    }


    public function setOpt($val)
    {
        $this->_opt = $val;
    }


    public function setPrixHT($val)
    {
        $this->_prix_ht = $val;
    }


    public function setPrixTTC($val)
    {
        $this->_prix_ttc = $val;
    }


    public function setUnitPrix($val)
    {
        $this->_unit_prix = $val;
    }


    public function setPrixLivraisonHT($val)
    {
        $this->_prix_livraison_ht = $val;
    }


    public function setPrixLivraisonTTC($val)
    {
        $this->_prix_livraison_ttc = $val;
    }


    public function setIdSupport($val)
    {
        $this->_idsupport = $val;
    }


    public function setSupport($val)
    {
        $this->_support = $val;
    }


    public function setQte($val)
    {
        $this->_qte = $val;
    }


    public function setIdQte($val)
    {
        $this->_id_qte = $val;
    }


    public function setTitle($val)
    {
        $this->_title = $val;
    }


    public function setData($val)
    {
        $this->_data = $val;
    }


    public function setCreatedBy($val)
    {
        $this->_created_by = $val;
    }

    public function setModifiedBy($val)
    {
        $this->_modified_by = $val;
    }

    public function setDateCreated($val)
    {
        $this->_date_created = $val;
    }

    public function setDateModified($val)
    {
        $this->_date_modified = $val;
    }

    public function setFlag($val)
    {
        $this->_flag = $val;
    }

    public function setStatus($val)
    {
        $this->_status = $val;
    }

    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getIdOrder()
    {
        return $this->_id_order;
    }

    public function getBase64Image()
    {
        return $this->_base64_image;
    }

    public function getBonRepli()
    {
        return $this->_bonrepli;
    }

    public function getCommentaire()
    {
        return $this->_commentaire;
    }

    public function getDimension()
    {
        return $this->_dimension;
    }

    public function getIdDimension()
    {
        return $this->_id_dimension;
    }

    public function getEscargot()
    {
        return $this->_escargot;
    }

    public function getEscargotVal()
    {
        return $this->_escargot_val;
    }

    public function getContours()
    {
        return $this->_contours;
    }

    public function getLiserai()
    {
        return $this->_liserai;
    }

    public function getOpt()
    {
        return $this->_opt;
    }

    public function getPrixHT()
    {
        return $this->_prix_ht;
    }

    public function getPrixTTC()
    {
        return $this->_prix_ttc;
    }

    public function getUnitPrix()
    {
        return $this->_unit_prix;
    }

    public function getPrixLivraisonHT()
    {
        return $this->_prix_livraison_ht;
    }

    public function getPrixLivraisonTTC()
    {
        return $this->_prix_livraison_ttc;
    }

    public function getIdSupport()
    {
        return $this->_idsupport;
    }

    public function getSupport()
    {
        return $this->_support;
    }

    public function getQte()
    {
        return $this->_qte;
    }

    public function getIdQte()
    {
        return $this->_id_qte;
    }

    public function getTitle()
    {
        return $this->_title;
    }

    public function getData()
    {
        return $this->_data;
    }

    public function getCreatedBy()
    {
        return $this->_created_by;
    }

    public function getModifiedBy()
    {
        return $this->_modified_by;
    }

    public function getDateCreated()
    {
        return $this->_date_created;
    }

    public function getDateModified()
    {
        return $this->_date_modified;
    }

    public function getFlag()
    {
        return $this->_flag;
    }

    public function getStatus()
    {
        return $this->_status;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM orders_details WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE orders_details SET id_order='" . ($this->_id_order) . "'";
            $requete .= ",base64_image='" . $this->_base64_image . "'";
            $requete .= ",bonrepli='" . $this->_bonrepli . "'";
            $requete .= ",commentaire='" . $this->_commentaire . "'";
            $requete .= ",dimension='" . $this->_dimension . "'";
            $requete .= ",id_dimension='" . $this->_id_dimension . "'";
            $requete .= ",escargot='" . $this->_escargot . "'";
            $requete .= ",escargot_val='" . $this->_escargot_val . "'";
            $requete .= ",contours='" . $this->_contours . "'";
            $requete .= ",liserai='" . $this->_liserai . "'";
            $requete .= ",opt='" . $this->_opt . "'";
            $requete .= ",prix_ht='" . $this->_prix_ht . "'";
            $requete .= ",prix_ttc='" . $this->_prix_ttc . "'";
            $requete .= ",unitprix='" . $this->_unit_prix . "'";
            $requete .= ",prix_livraison_ht='" . $this->_prix_livraison_ht . "'";
            $requete .= ",prix_livraison_ttc='" . $this->_prix_livraison_ttc . "'";
            $requete .= ",idsupport='" . $this->_idsupport . "'";
            $requete .= ",support='" . $this->_support . "'";
            $requete .= ",qte='" . $this->_qte . "'";
            $requete .= ",id_qte='" . $this->_id_qte . "'";
            $requete .= ",title='" . $this->_title . "'";
            $requete .= ",data='" . ($this->_data) . "'";
            $requete .= ",created_by='" . $this->_created_by . "'";
            $requete .= ",modified_by='" . $this->_modified_by . "'";
            $requete .= ",date_created='" . $this->_date_created . "'";
            $requete .= ",date_modified='" . $this->_date_modified . "'";
            $requete .= ",flag='" . $this->_flag . "'";
            $requete .= ",status='" . $this->_status . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO orders_details (";
            $requete .= "id_order";
            $requete .= ",base64_image";
            $requete .= ",bonrepli";
            $requete .= ",commentaire";
            $requete .= ",dimension";
            $requete .= ",id_dimension";
            $requete .= ",escargot";
            $requete .= ",escargot_val";
            $requete .= ",contours";
            $requete .= ",liserai";
            $requete .= ",opt";
            $requete .= ",prix_ht";
            $requete .= ",prix_ttc";
            $requete .= ",unitprix";
            $requete .= ",prix_livraison_ht";
            $requete .= ",prix_livraison_ttc";
            $requete .= ",idsupport";
            $requete .= ",support";
            $requete .= ",qte";
            $requete .= ",id_qte";
            $requete .= ",title";
            $requete .= ",data";
            $requete .= ",created_by";
            $requete .= ",modified_by";
            $requete .= ",date_created";
            $requete .= ",date_modified";
            $requete .= ",flag";
            $requete .= ",status";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_order . "',";
            $requete .= "'" . $this->_base64_image . "',";
            $requete .= "'" . $this->_bonrepli . "',";
            $requete .= "'" . $this->_commentaire . "',";
            $requete .= "'" . $this->_dimension . "',";
            $requete .= "'" . $this->_id_dimension . "',";
            $requete .= "'" . $this->_escargot . "',";
            $requete .= "'" . $this->_escargot_val . "',";
            $requete .= "'" . $this->_contours . "',";
            $requete .= "'" . $this->_liserai . "',";
            $requete .= "'" . $this->_opt . "',";
            $requete .= "'" . $this->_prix_ht . "',";
            $requete .= "'" . $this->_prix_ttc . "',";
            $requete .= "'" . $this->_unit_prix . "',";
            $requete .= "'" . $this->_prix_livraison_ht . "',";
            $requete .= "'" . $this->_prix_livraison_ttc . "',";
            $requete .= "'" . $this->_idsupport . "',";
            $requete .= "'" . $this->_support . "',";
            $requete .= "'" . $this->_qte . "',";
            $requete .= "'" . $this->_id_qte . "',";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . $this->_data . "',";
            $requete .= "'" . $this->_created_by . "',";
            $requete .= "'" . $this->_modified_by . "',";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_date_modified . "',";
            $requete .= "'" . $this->_flag . "',";
            $requete .= "'" . $this->_status . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $orders_details = new orders_details();
        $orders_details->_id = $rs["id"];
        $orders_details->_id_order = $rs["id_order"];
        $orders_details->_base64_image = $rs["base64_image"];
        $orders_details->_bonrepli = $rs["bonrepli"];
        $orders_details->_commentaire = $rs["commentaire"];
        $orders_details->_dimension = $rs["dimension"];
        $orders_details->_id_dimension = $rs["id_dimension"];
        $orders_details->_escargot = $rs["escargot"];
        $orders_details->_escargot_val = $rs["escargot_val"];
        $orders_details->_contours = $rs["contours"];
        $orders_details->_liserai = $rs["liserai"];
        $orders_details->_opt = $rs["opt"];
        $orders_details->_prix_ht = $rs["prix_ht"];
        $orders_details->_prix_ttc = $rs["prix_ttc"];
        $orders_details->_unit_prix = $rs["unitprix"];
        $orders_details->_prix_livraison_ht = $rs["prix_livraison_ht"];
        $orders_details->_prix_livraison_ttc = $rs["prix_livraison_ttc"];
        $orders_details->_idsupport = $rs["idsupport"];
        $orders_details->_support = $rs["support"];
        $orders_details->_qte = $rs["qte"];
        $orders_details->_id_qte = $rs["id_qte"];
        $orders_details->_title = $rs["title"];
        $orders_details->_data = $rs["data"];
        $orders_details->_created_by = $rs["created_by"];
        $orders_details->_modified_by = $rs["modified_by"];
        $orders_details->_date_created = $rs["date_created"];
        $orders_details->_date_modified = $rs["date_modified"];
        $orders_details->_flag = $rs["flag"];
        $orders_details->_status = $rs["status"];
        return $orders_details;
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

    public function findByPrimaryKey1($key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE id=" . $key;
        $rs = $this->conn->query($requete);

        return json_encode(mysqli_fetch_array($rs));
    }

    public function getCountProds($id)
    {
        $requete = "select count(*) as prods from orders_details WHERE id_order=" . $id;
        $rs = $this->conn->query($requete);
        return mysqli_fetch_array($rs);
    }

    public function getMaxId()
    {
        $requete = "select max(id) as id from orders_details ";
        $requete = "select max(id) as id from orders_details ";
        $rs = $this->conn->query($requete);
        return mysqli_fetch_array($rs);
    }

    public function getProds($id)
    {
        $requete = "select * from orders_details WHERE id_order=" . $id ." order by date_created desc";
        $rs = $this->conn->query($requete);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function updateStatusProds($id, $status) {
        $requete = "update order_details set status=".$status." where id_order=".$id;
        $rs = $this->conn->query($requete);
        return "done";
    }
} 