<?php
include_once 'include_all.php';
include_once "../chromePHP.php";
$mode = intval($_POST["mode"]);
session_start();

if($mode == 1) {
    $temp_prod = new temp_prod();
    $temp_prod = $temp_prod->findBySession(session_id());

    chromePHP::log(session_id());
    print json_encode($temp_prod);
}