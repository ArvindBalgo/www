<?php

class orders_main
{
    //**** Variables declarations ****
    private $_id = null;
    private $_id_user = 0;
    private $_id_commercial = 0;
    private $_via_commercial = 0;
    private $_total_livraison_ht = 0;
    private $_total_livraison_ttc = 0;
    private $_total_prix_ht = 0;
    private $_total_prix_ttc = 0;
    private $_tax = 0;
    private $_total_prix_net = 0;
    private $_comments = "";
    private $_status = "";
    private $_date_created = "";
    private $_date_modified = "";
    private $_created_by = 0;
    private $_modified_by = 0;

    private static $SELECT = "SELECT * FROM orders_main";

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

    public function setIdUser($val)
    {
        $this->_id_user = $val;
    }

    public function setIdCommercial($val)
    {
        $this->_id_commercial = $val;
    }

    public function setViaCommercial($val)
    {
        $this->_via_commercial = $val;
    }

    public function setTotalLivraisonHT($val)
    {
        $this->_total_livraison_ht = $val;
    }

    public function setTotalLivraisonTTC($val)
    {
        $this->_total_livraison_ttc = $val;
    }

    public function setTotalPrixHT($val)
    {
        $this->_total_prix_ht = $val;
    }

    public function setTotalPrixTTC($val)
    {
        $this->_total_prix_ttc = $val;
    }

    public function setTax($val)
    {
        $this->_tax = $val;
    }

    public function setTotalPrixNet($val)
    {
        $this->_total_prix_net = $val;
    }

    public function setStatus($val)
    {
        $this->_status = $val;
    }

    public function setComments($val)
    {
        $this->_comments = $val;
    }

    public function setDateCreated($val)
    {
        $this->_date_created = $val;
    }

    public function setDateModified($val)
    {
        $this->_date_modified = $val;
    }

    public function setCreatedBy($val)
    {
        $this->_created_by = $val;
    }

    public function setModifiedBy($val)
    {
        $this->_modified_by = $val;
    }

    //**** Getters *****

    public function getId()
    {
        return $this->_id;
    }

    public function getIdUser()
    {
        return $this->_id_user;
    }

    public function getIdCommercial()
    {
        return $this->_id_commercial;
    }

    public function getViaCommercial()
    {
        return $this->_via_commercial;
    }

    public function getTotalLivraisonHT()
    {
        return $this->_total_livraison_ht;
    }

    public function getTotalLivraisonTTC()
    {
        return $this->_total_livraison_ttc;
    }

    public function getTotalPrixHT()
    {
        return $this->_total_prix_ht;
    }

    public function getTotalPrixTTC()
    {
        return $this->_total_prix_ttc;
    }

    public function getTax()
    {
        return $this->_tax;
    }

    public function getTotalPrixNet()
    {
        return $this->_total_prix_net;
    }

    public function getStatus()
    {
        return $this->_status;
    }


    public function getComments()
    {
        return $this->_comments;
    }

    public function getDateCreated()
    {
        return $this->_date_created;
    }

    public function getDateModified()
    {
        return $this->_date_modified;
    }

    public function getCreatedBy()
    {
        return $this->_created_by;
    }

    public function getModifiedBy()
    {
        return $this->_modified_by;
    }

    public function delete($id)
    {
        $requete = "DELETE FROM orders_main WHERE id=" . $id;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }

    //***** fonction de modification/cr�ation *****
    public function save()
    {

        if ($this->_id > 0) {
            $requete = "UPDATE orders_main SET id_user='" . ($this->_id_user) . "'";
            $requete .= ", id_commercial='" . $this->_id_commercial . "'";
            $requete .= ", via_commercial='" . $this->_via_commercial . "'";
            $requete .= ", total_livraison_ht='" . $this->_total_livraison_ht . "'";
            $requete .= ", total_livraison_ttc='" . $this->_total_livraison_ttc . "'";
            $requete .= ", total_prix_ht='" . $this->_total_prix_ht . "'";
            $requete .= ", total_prix_ttc='" . $this->_total_prix_ttc . "'";
            $requete .= ", tax='" . $this->_tax . "'";
            $requete .= ", total_prix_net='" . $this->_total_prix_net . "'";
            $requete .= ", comments='" . $this->_comments . "'";
            $requete .= ", status='" . $this->_status . "'";
            $requete .= ", date_created='" . $this->_date_created . "'";
            $requete .= ", date_modified='" . $this->_date_modified . "'";
            $requete .= ", created_by='" . $this->_created_by . "'";
            $requete .= ", modified_by='" . $this->_modified_by . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO orders_main (";
            $requete .= "id_user";
            $requete .= ",id_commercial";
            $requete .= ",via_commercial";
            $requete .= ",total_livraison_ht";
            $requete .= ",total_livraison_ttc";
            $requete .= ",total_prix_ht";
            $requete .= ",total_prix_ttc";
            $requete .= ",tax";
            $requete .= ",total_prix_net";
            $requete .= ",comments";
            $requete .= ",status";
            $requete .= ",date_created";
            $requete .= ",date_modified";
            $requete .= ",created_by";
            $requete .= ",modified_by";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id_user . "',";
            $requete .= "'" . $this->_id_commercial . "',";
            $requete .= "'" . $this->_via_commercial . "',";
            $requete .= "'" . $this->_total_livraison_ht . "',";
            $requete .= "'" . $this->_total_livraison_ttc . "',";
            $requete .= "'" . $this->_total_prix_ht . "',";
            $requete .= "'" . $this->_total_prix_ttc . "',";
            $requete .= "'" . $this->_tax . "',";
            $requete .= "'" . $this->_total_prix_net . "',";
            $requete .= "'" . $this->_comments . "',";
            $requete .= "'" . $this->_status . "',";
            $requete .= "'" . $this->_date_created . "',";
            $requete .= "'" . $this->_date_modified . "',";
            $requete .= "'" . $this->_created_by . "',";
            $requete .= "'" . $this->_modified_by . "')";
        }
        chromePHP::log($requete);
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        $orders_main = new orders_main();
        $orders_main->_id = $rs["id"];
        $orders_main->_total_livraison_ht = $rs["total_livraison_ht"];
        $orders_main->_total_livraison_ttc = $rs["total_livraison_ttc"];
        $orders_main->_id_user = $rs["id_user"];
        $orders_main->_id_commercial= $rs["id_commercial"];
        $orders_main->_via_commercial= $rs["via_commercial"];
        $orders_main->_total_prix_ht = $rs["total_prix_ht"];
        $orders_main->_total_prix_ttc = $rs["total_prix_ttc"];
        $orders_main->_tax = $rs["tax"];
        $orders_main->_total_prix_net = $rs["total_prix_net"];
        $orders_main->_comments = $rs["comments"];
        $orders_main->_status = $rs["status"];
        $orders_main->_date_created = $rs["date_created"];
        $orders_main->_date_modified = $rs["date_modified"];
        $orders_main->_created_by = $rs["created_by"];
        $orders_main->_modified_by = $rs["modified_by"];
        return $orders_main;
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

    public function fnGetLastId()
    {
        $requete = "select max(id) as id from orders_main";
        $rs = $this->conn->query($requete);

        return mysqli_fetch_array($rs);
    }

    public function findAllOngoingOrders()
    {
        $requete = self::$SELECT . " where status !='ARCHIEVE' and id_user>0";
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByUser($idUser)
    {
        $requete = self::$SELECT . " where id_user =" . $idUser . " order by date_created desc";
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByIdCommercial($idUser)
    {
        $requete = self::$SELECT . " where id_user =" . $idUser . " or id_commercial=".$idUser." order by date_created desc";
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }
} 