<?php
include_once 'include_all.php';
include_once "../chromePHP.php";
$mode = intval($_POST["mode"]);
session_start();

if($mode == 1) {
    $temp_prod = new temp_prod();
    $temp_prod = $temp_prod->findBySession(session_id());

    print json_encode($temp_prod);
    $temp_prod=null;
}
else if($mode == 2) {
    $key = trim($_POST["key_prod"]);
    $temp_prod = new temp_prod();

    $temp_prod = $temp_prod->findBySessionKey(session_id(), $key);

    if($temp_prod == 'false') {
        print json_decode("");
    }
    else {
        print $temp_prod->getbase64Image();
    }
    $temp_prod=null;

}
else if($mode == 3) {
    $key = trim($_POST["key_prod"]);
    $temp_prod = new temp_prod();

    $temp_prod = $temp_prod->findBySessionKey1(session_id(), $key);

    if($temp_prod == 'false') {
        print json_decode("");
    }
    else {
        print json_encode($temp_prod);
    }
    $temp_prod=null;
}