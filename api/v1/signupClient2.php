<?php
require 'authFN.php';
require_once '../classes/passwordHash.php';
$response = array();
$r = json_decode($app->request->getBody());
verifyRequiredParams(array('email', 'name', 'password'),$r->customer);
//require_once 'passwordHash.php';
$db = new DbHandler();
/*
 * $sess["uid"] = $_SESSION['uid'];
        $sess["name"] = $_SESSION['name'];
        $sess["email"] = $_SESSION['email'];
        $sess["admin"] = $_SESSION['admin'];
        $sess["admintype"] = $_SESSION['admintype'];
        $sess["pays"] = $_SESSION['pays'];
        $sess["city"] = $_SESSION['city'];
        $sess["surname"] = $_SESSION['surname'];
        $sess["tel"] = $_SESSION['tel'];
        $sess["address"] = $_SESSION['address'];
        $sess["postalcode"] = $_SESSION['postalcode'];
 *  */

$phone = $r->customer->phone;
$name = $r->customer->name;
$surname = $r->customer->surname;
$email = strtolower(trim($r->customer->email));
$address = $r->customer->address;
$password = $r->customer->password;
$postalcode = $r->customer->postalcode;
$nosiret = $r->customer->nosiret;
$departement= $r->customer->department;
$companyName= $r->customer->company_name;

$isUserExists = $db->getOneRecord("select 1 from customers_auth where (email='$email') and admin=0");
if(!$isUserExists){
    $r->customer->password = passwordHash::hash($password);
    $table_name = "customers_auth";
    $column_names = array('phone', 'name','surname', 'email', 'password', 'city', 'address', 'pays', 'postalcode', 'nosiret', 'department', 'company_name');
    $result = $db->insertIntoTable($r->customer, $column_names, $table_name);
    if ($result != NULL) {
        $response["status"] = 1;
        $response["message"] = "User account created successfully";
        $response["uid"] = $result;
        if (!isset($_SESSION)) {
            session_start();
        }
        echoResponse(200, $response);
    } else {
        $response["status"] = 0;
        $response["message"] = "Failed to create customer. Please try again";
        echoResponse(201, $response);
    }
}else{
    $response["status"] = "error";
    $response["message"] = "An user with the provided phone or email exists!";
    echoResponse(201, $response);
}