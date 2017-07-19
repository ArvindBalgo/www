<?php
/**
 * Created by PhpStorm.
 * User: Arvind
 * Date: 19/07/2017
 * Time: 04:12
 */
require 'authFN.php';
require_once '../classes/passwordHash.php';
if (!isset($_SESSION)) {
    session_start();
}
if($_SESSION["uid"] == "") {
    print json_encode(0);
    return;
}
if($_POST["password"] == "" || $_POST["password1"] || $_POST["password2"] == "") {
    print json_encode(0);
    return;
}

$db = new DbHandler();
$user = $db->getOneRecord("select uid,name,password,email,created,admin, pays, surname, city, postalcode,phone, address, admintype  from customers_auth where uid=".$_SESSION["uid"]);
if($user != NULL) {
    if(passwordHash::check_password($user['password'],$_POST["password"])){
        $user = new users();
        $user = $user->findByPrimaryKey($_SESSION["uid"]);
        if($user) {
            $user->setPassword( passwordHash::hash($password));
            $user->save();
        }
    }
    else {
        print json_encode(0);
        return;
    }
}
else {
    print json_encode(0);
    return;
}