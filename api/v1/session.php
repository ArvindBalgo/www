<?php
include_once "../chromePHP.php";
if (!isset($_SESSION)) {
            session_start();
        }
require 'authFN.php';


$db = new DbHandler();

$session = $db->getSession();

$response["uid"] = $session['uid'];
$response["email"] = $session['email'];
$response["name"] = $session['name'];
$response["surname"] = $session['surname'];
$response["type"] = $session['admin'];
$response["admin"] = $session['admin'];
$response["admintype"] = $session['admintype'];
$response["pays"] = $session['pays'];
$response["address"] = $session['address'];
$response["city"] = $session['city'];
$response["postalcode"] = $session['postalcode'];
$response["tel"] = $session['tel'];
$response["token"] = $session['token'];
echoResponse(200, $response);
