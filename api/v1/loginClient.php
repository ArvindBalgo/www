<?php

require 'authFN.php';
require_once '../classes/passwordHash.php';
include_once '../classes/users.php';
$response = array();
$r = json_decode($app->request->getBody());
verifyRequiredParams(array('email', 'password'), $r->customer);
$response = array();
$db = new DbHandler();
$password = $r->customer->password;
$email = $r->customer->email;
$user = $db->getOneRecord("select uid,name,password,email,created,admin, pays, surname, city, postalcode,phone, address, admintype, token, salesman  from customers_auth where (phone='$email' or email='$email') and admin=0");

if ($user != NULL) {
    if (passwordHash::check_password($user['password'], $password)) {
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['name'] = $user['name'];
        $response['uid'] = $user['uid'];
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created'];
        $response['address'] = $user['address'];
        $response['admin'] = $user['admin'];
        $response['admintype'] = $user['admintype'];
        $response['pays'] = $user['pays'];
        $response['surname'] = $user['surname'];
        $response['tel'] = $user['phone'];
        $response['city'] = $user['city'];
        $response['postalcode'] = $user['postalcode'];
        $response['salesman'] = $user['salesman'];

        $token =  substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(25/strlen($x)) )),1,25);
        $user1 = new users();
        $user1 = $user1->findByPrimaryKey($user['uid']);
        $user1->setToken($token);
        $user1->save();
        $response['token'] = $token;

        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $user['uid'];
        $_SESSION['email'] = $email;
        $_SESSION['name'] = $user['name'];
        $_SESSION['admin'] = $user['admin'];
        $_SESSION['admintype'] = $user['admintype'];
        $_SESSION['pays'] = $user['pays'];
        $_SESSION['surname'] = $user['surname'];
        $_SESSION['tel'] = $user['phone'];
        $_SESSION['city'] = $user['city'];
        $_SESSION['postalcode'] = $user['postalcode'];
        $_SESSION['address'] = $user['address'];
        $_SESSION['token'] = $token;
        $_SESSION['salesman'] = $user['salesman'];
    } else {
        $response['status'] = "error";
        $response['message'] = 'Login failed. Incorrect credentials';
    }
} else {
    $response['status'] = "error";
    $response['message'] = 'No such user is registered';
}
echoResponse(200, $response);