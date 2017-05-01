<?php

require 'authFN.php';
require_once '../classes/passwordHash.php';
$response = array();
$r = json_decode($app->request->getBody());
verifyRequiredParams(array('email', 'password'),$r->customer);
$response = array();
$db = new DbHandler();
$password = $r->customer->password;
$email = $r->customer->email;
$user = $db->getOneRecord("select uid,name,password,email,created,admin, pays from customers_auth where (phone='$email' or email='$email') and admin=0");

if ($user != NULL) {
    if(passwordHash::check_password($user['password'],$password)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['name'] = $user['name'];
        $response['uid'] = $user['uid'];
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created'];
        $response['admin'] = $user['admin'];
        $response['pays'] = $user['pays'];

        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $user['uid'];
        $_SESSION['email'] = $email;
        $_SESSION['name'] = $user['name'];
        $_SESSION['admin'] = $user['admin'];
        $_SESSION['pays'] = $user['pays'];
    } else {
        $response['status'] = "error";
        $response['message'] = 'Login failed. Incorrect credentials';
    }
}else {
    $response['status'] = "error";
    $response['message'] = 'No such user is registered';
}
echoResponse(200, $response);