<?php
include_once 'include_all.php';
require 'authFN.php';
require_once '../classes/passwordHash.php';
require '../PHPMailerAutoload.php';
$response = array();
//$r = json_decode($app->request->getBody());
//verifyRequiredParams(array('email', 'name', 'password'),$r->customer);
//require_once 'passwordHash.php';
$db = new DbHandler();

$phone = $_GET["telephone"];
$uid = $_GET["uid"];
$name = $_GET["prenom"];
$surname = $_GET["nom"];
$email = $_GET["email"];
$address = $_GET["address"];
$postalcode = $_GET["postalCode"];
$nosiret = '';
$pays = $_GET["pays"];
$city = $_GET["city"];
$min_val = $_GET["min_val"];
$max_val = $_GET["max_val"];
/*
$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
$charactersLength = strlen($characters);
$randomString = '';
for ($i = 0; $i < 9; $i++) {
    $randomString .= $characters[rand(0, $charactersLength - 1)];
}

$password = $randomString;*/
if ($surname == "" || $name == "" || $email == "") {
    $response["status"] = "error";
    $response["message"] = "An user with the provided phone or email exists!";
    echoResponse(201, $response);
    return;
}
$user = new users();
$user = $user->findByPrimaryKey($uid);
if (!$user) {
    $user = new users();
}
$user->setPhone($phone);
$user->setName($name);
$user->setSurname($surname);
$user->setEmail($email);
$user->setAddress($address);
$user->setPostalCode($postalcode);
$user->setPays($pays);
$user->setCity($city);
$user->setMinVal($min_val);
$user->setMaxVal($max_val);
$user->save();
echo "done";