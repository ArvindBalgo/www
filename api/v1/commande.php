<?php
/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 14/09/2016
 * Time: 22:11
 */

/*CREATE TABLE `commande` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `addon` int(11) NOT NULL,
  `dimension` text NOT NULL,
  `quantite` int(11) NOT NULL,
  `commentaire` int(11) NOT NULL,
  `prix` int(11) NOT NULL,
  `id_front` int(11) NOT NULL,
  `id_back` int(11) NOT NULL,
  `src` text NOT NULL,
  `createdby` int(11) NOT NULL,
  `createdon` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
*/

class commande {

    //**** Variables declarations ****
    private $_id = null;
    private $_title = "";
    private $_addon = 0;
    private $_dimension = "";
    private $_quantite = "";
    private $_commentaire = "";
    private $_prix = 0;
    private $_id_front = 0;
    private $_id_back = 0;
    private $_src = "";
    private $_bonrepli = "";
    private $_createdby = "";
    private $_createdon = "";


    //**** Constructeur ****
    public function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    private static $SELECT="SELECT * FROM commande";

    //**** Setters *****
    public function setId($Id) {
        $this->_id= $Id;
    }

    public function setTitle($title) {
        $this->_title= $title;
    }

    public function setAddon($addon) {
        $this->_addon= $addon;
    }

    public function setDimension($dimension) {
        $this->_dimension= $dimension;
    }

    public function setQuantite($qte) {
        $this->_quantite= $qte;
    }

    public function setCommentaire($comm) {
        $this->_commentaire= $comm;
    }

    public function setPrix($prix) {
        $this->_prix= $prix;
    }

    public function setIDFront($idFront) {
        $this->_id_front= $idFront;
    }

    public function setCreatedBy($createdby) {
        $this->_createdby= $createdby;
    }

    public function setCreatedOn($createdon) {
        $this->_createdon= $createdon;
    }

    public function setIDBack($idBack) {
        $this->_id_back= $idBack;
    }

    public function setSrc($src){
        $this->_src = $src;
    }

    public function setBonRepli($flag){
        $this->_bonrepli = $flag;
    }

    //**** Getters *****
    public function getId($Id) {
        return $this->_id;
    }

    public function getTitle() {
        return $this->_title;
    }

    public function getAddon() {
        return $this->_addon;
    }

    public function getDimension() {
        return $this->_dimension;
    }

    public function getQuantite() {
        return $this->_quantite;
    }

    public function getCommentaire() {
        return $this->_commentaire;
    }

    public function getPrix() {
        return $this->_prix;
    }

    public function getIDFront() {
        return $this->_id_front;
    }

    public function getIDBack() {
        return $this->_id_back;
    }

    public function getCreatedBy() {
        return $this->_createdby;
    }

    public function getCreatedOn(){
        return $this->_createdon;
    }

    public function getSrc() {
        return $this->_src;
    }

    public function getBonRepli() {
        return $this->_bonrepli;
    }

    public function delete($Id) {
        $requete = "DELETE FROM commande WHERE id=" . $Id ;
        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save() {
        // $this->_date_filled = date('Y/m/d H:i:s', time());
        if ($this->_createdon == null || $this->_createdon == "") {
            $this->_createdon= date('Y/m/d H:i:s', time());
        }
        if ($this->_id > 0) {
            $requete = "UPDATE commande SET title='" . ($this->_title) . "'";
            $requete .= ",addon='" . $this->_addon . "'";
            $requete .= ",dimension='" . $this->_dimension . "'";
            $requete .= ",quantite='" . $this->_quantite . "'";
            $requete .= ",commentaire='" . $this->_commentaire . "'";
            $requete .= ",prix='" . $this->_prix . "'";
            $requete .= ",id_front='" . $this->_id_front . "'";
            $requete .= ",id_back='" . $this->_id_back . "'";
            $requete .= ",src='" . $this->_src . "'";
            $requete .= ",bonrepli='" . $this->_bonrepli . "'";
            $requete .= ",createdby='" . $this->_createdby . "'";
            $requete .= ",createdon='" . $this->_createdon . "'";
            $requete .= " WHERE id=" . $this->_id;

        } else {
            $requete = "INSERT INTO commande (";
            $requete .= "id,";
            $requete .= "title,";
            $requete .= "addon,";
            $requete .= "dimension,";
            $requete .= "quantite,";
            $requete .= "commentaire,";
            $requete .= "prix,";
            $requete .= "id_front,";
            $requete .= "id_back,";
            $requete .= "src,";
            $requete .= "bonrepli,";
            $requete .= "createdby,";
            $requete .= "createdon";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_id . "',";
            $requete .= "'" . $this->_title . "',";
            $requete .= "'" . $this->_addon . "',";
            $requete .= "'" . $this->_dimension . "',";
            $requete .= "'" . $this->_quantite . "',";
			$requete .= "'" . $this->_commentaire . "',";
			$requete .= "'" . $this->_prix . "',";
			$requete .= "'" . $this->_id_front . "',";
			$requete .= "'" . $this->_id_back . "',";
			$requete .= "'" . $this->_src . "',";
			$requete .= "'" . $this->_bonrepli . "',";
			$requete .= "'" . $this->_createdby . "',";
			$requete .= "'" . $this->_createdon . "')";
        }

        $r = $this->conn->query($requete) or die($this->conn->error.__LINE__);
        return $r;
    }



    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs) {
        $comm               = new commande();
        $comm->_id          = $rs["id"];
        $comm->_title       = $rs["title"];
        $comm->_addon       = $rs["addon"];
        $comm->_dimension   = $rs["dimension"];
        $comm->_quantite    = $rs["quantite"];
        $comm->_commentaire = $rs["commentaire"];
        $comm->_prix        = $rs["prix"];
        $comm->_id_front    = $rs["id_front"];
        $comm->_id_back     = $rs["id_back"];
        $comm->_src         = $rs["src"];
        $comm->_bonrepli    = $rs["bonrepli"];
        $comm->_createdby   = $rs["createdby"];
        $comm->_createdon   = $rs["createdon"];

        return $comm;
    }

    public function rechercher() { // Retourner toutes
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
        if (!$rs) {
            return null;
        }
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }

    public function getLastId(){
        $requete = "SELECT MAX(id) AS id FROM commande";
        $rs = $this->conn->query($requete);
        $result = mysqli_fetch_array($rs);
        return $result["id"];
    }
} 