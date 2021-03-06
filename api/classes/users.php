<?php

/**
 * Created by PhpStorm.
 * User: Trisha
 * Date: 13/07/2016
 * Time: 22:50
 */
class users
{
    //**** Variables declarations ****
    private $_uid = null;
    private $_company_name = "";
    private $_name = null;
    private $_surname = "";
    private $_email = null;
    private $_phone = null;
    private $_password = null;
    private $_address = null;
    private $_city = null;
    private $_pays = "FR";
    private $_created = null;
    private $_postalcode = null;
    private $_admintype = 0;
    private $_nosiret = "";
    private $_token = "";
    private $_salesman = 0;
    private $_min_val = 0;
    private $_max_val = 0;
    private $_department = 0;

    private static $SELECT = "SELECT * FROM customers_auth ";


    //**** Constructeur ****
    public function __construct()
    {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    //**** Setters *****
    public function setUid($uid)
    {
        $this->_uid = $uid;
    }

    public function setCompanyName($name)
    {
        $this->_company_name = $name;
    }

    public function setName($name)
    {
        $this->_name = $name;
    }

    public function setSurname($name)
    {
        $this->_surname = $name;
    }

    public function setEmail($email)
    {
        $this->_email = $email;
    }

    public function setPhone($phone)
    {
        $this->_phone = $phone;
    }

    public function setPassword($password)
    {
        $this->_password = $password;
    }

    public function setAddress($address)
    {
        $this->_address = $address;
    }

    public function setCity($city)
    {
        $this->_city = $city;
    }

    public function setPays($pays)
    {
        $this->_pays = $pays;
    }

    public function setCreated($created)
    {
        $this->_created = $created;
    }

    public function setPostalCode($postalCode)
    {
        $this->_postalcode = $postalCode;
    }

    public function setAdmintype($type)
    {
        $this->_admintype = $type;
    }

    public function setSiret($val)
    {
        $this->_nosiret = $val;
    }

    public function setToken($val)
    {
        $this->_token = $val;
    }

    public function setSalesman($val)
    {
        $this->_salesman = $val;
    }

    public function setMinVal($val)
    {
        $this->_min_val = $val;
    }

    public function setMaxVal($val)
    {
        $this->_max_val = $val;
    }

    public function setDepartment($val)
    {
        $this->_department = $val;
    }

    //**** Getters *****

    public function getUid()
    {
        return $this->_uid;
    }

    public function getCompanyName()
    {
        return $this->_company_name;
    }


    public function getName()
    {
        return $this->_name;
    }


    public function getSurname()
    {
        return $this->_surname;
    }

    public function getEmail()
    {
        return $this->_email;
    }

    public function getPhone()
    {
        return $this->_phone;
    }

    public function getPassword()
    {
        return $this->_password;
    }

    public function getAddress()
    {
        return $this->_address;
    }

    public function getCity()
    {
        return $this->_city;
    }

    public function getPays()
    {
        return $this->_pays;
    }

    public function getCreated()
    {
        return $this->_created;
    }

    public function getPostalCode()
    {
        return $this->_postalcode;
    }

    public function getAdmintype()
    {
        return $this->_admintype;
    }

    public function getSiret()
    {
        return $this->_nosiret;
    }

    public function getToken()
    {
        return $this->_token;
    }

    public function getSalesman()
    {
        return $this->_salesman;
    }

    public function getMinVal()
    {
        return $this->_min_val;
    }

    public function getMaxVal()
    {
        return $this->_max_val;
    }

    public function getDepartment()
    {
        return $this->_department;
    }

    public function delete($uid)
    {
        $requete = "delete from customers_auth where uid=" . $uid;
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
    }


    //***** fonction de modification/cr�ation *****
    public function save()
    {
        // $this->_date_modified = date('Y/m/d H:i:s', time());
        if ($this->_created == null) {
            $this->_created = date('Y/m/d H:i:s', time());
        }
        if ($this->_uid > 0) {
            $requete = "update customers_auth set name='" . ($this->_name) . "'";
            $requete .= ",company_name='" . $this->_company_name . "'";
            $requete .= ",surname='" . $this->_surname . "'";
            $requete .= ",email='" . $this->_email . "'";
            $requete .= ",phone='" . $this->_phone . "'";
            $requete .= ",password='" . $this->_password . "'";
            $requete .= ",address='" . addslashes($this->_address ). "'";
            $requete .= ",city='" . $this->_city . "'";
            $requete .= ",pays='" . $this->_pays . "'";
            $requete .= ",created='" . $this->_created . "'";
            $requete .= ",admintype='" . $this->_admintype . "'";
            $requete .= ",nosiret='" . $this->_nosiret . "'";
            $requete .= ",postalcode='" . $this->_postalcode . "'";
            $requete .= ",token='" . $this->_token . "'";
            $requete .= ",salesman='" . $this->_salesman . "'";
            $requete .= ",min_val='" . $this->_min_val . "'";
            $requete .= ",max_val='" . $this->_max_val . "'";
            $requete .= ",department='" . $this->_department . "'";
            $requete .= " where uid=" . $this->_uid;

        } else {
            $requete = "insert into customers_auth (";
            $requete .= "company_name,";
            $requete .= "name,";
            $requete .= "surname,";
            $requete .= "email,";
            $requete .= "phone,";
            $requete .= "password,";
            $requete .= "address,";
            $requete .= "city,";
            $requete .= "pays,";
            $requete .= "postalcode,";
            $requete .= "admintype,";
            $requete .= "nosiret,";
            $requete .= "token,";
            $requete .= "created,";
            $requete .= "salesman,";
            $requete .= "min_val,";
            $requete .= "max_val,";
            $requete .= "department";
            $requete .= ") VALUES (";
            $requete .= "'" . $this->_company_name . "',";
            $requete .= "'" . $this->_name . "',";
            $requete .= "'" . $this->_surname . "',";
            $requete .= "'" . $this->_email . "',";
            $requete .= "'" . $this->_phone . "',";
            $requete .= "'" . $this->_password . "',";
            $requete .= "'" . addslashes($this->_address) . "',";
            $requete .= "'" . $this->_city . "',";
            $requete .= "'" . $this->_pays . "',";
            $requete .= "'" . $this->_postalcode . "',";
            $requete .= "'" . $this->_admintype . "',";
            $requete .= "'" . $this->_nosiret . "',";
            $requete .= "'" . $this->_token . "',";
            $requete .= "'" . $this->_created . "',";
            $requete .= "'" . $this->_salesman . "',";
            $requete .= "'" . $this->_min_val . "',";
            $requete .= "'" . $this->_max_val . "',";
            $requete .= "'" . $this->_department . "')";
        }
        $r = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        return $r;
    }


    //***** Fonction de passege sql->objet *****
    private function mapSqlToObject($rs)
    {
        if (!$rs || $rs == null) {
            return false;
        }

        $user = new users();
        $user->_uid = $rs["uid"];
        $user->_company_name = $rs["company_name"];
        $user->_name = $rs["name"];
        $user->_surname = $rs["surname"];
        $user->_email = $rs["email"];
        $user->_phone = $rs["phone"];
        $user->_password = $rs["password"];
        $user->_address = $rs["address"];
        $user->_city = $rs["city"];
        $user->_pays = $rs["pays"];
        $user->_postalcode = $rs["postalcode"];
        $user->_admintype = $rs["admintype"];
        $user->_nosiret = $rs["nosiret"];
        $user->_created = $rs["created"];
        $user->_token = $rs["token"];
        $user->_salesman = $rs["salesman"];
        $user->_min_val = $rs["min_val"];
        $user->_max_val = $rs["max_val"];
        $user->_department= $rs["department"];
        return $user;
    }

    public function rechercher()
    { // Recherche de toutes les adresses
        $listUSERS = array();
        $requete = self::$SELECT;
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function rechCommercial()
    { // Recherche de toutes les adresses
        $listUSERS = array();
        $requete = self::$SELECT . " where salesman=1";
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function rechClientParCommercial($idCommercial, $strDepts)
    { // Recherche de toutes les adresses
        $arrDepartments = explode(',', $strDepts);
        $strModified = implode("','", $arrDepartments);

        $listUSERS = array();
        $requete = "SELECT uid, company_name, name, surname, email, phone, address, city, pays, postalcode, nosiret, department from customers_auth" . " where salesman=0 and admintype=0 and department in ('".$strModified."')";
        $rs = $this->conn->query($requete) or die($this->conn->error . __LINE__);
        $rows = [];
        while ($row = mysqli_fetch_array($rs)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function findByPrimaryKey($key)
    { // Recherche d'une adresse par id
        $requete = self::$SELECT . " WHERE uid=" . $key;
        $rs = $this->conn->query($requete);
        return $this->mapSqlToObject(mysqli_fetch_array($rs));
    }
}