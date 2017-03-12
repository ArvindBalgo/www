<?php
include_once 'include_all.php';
include_once "../chromePHP.php";
if(! session_id()) {
    session_start();
}

$temp_prod = new temp_prod();
$temp_prod = $temp_prod->findBySessionKey(session_id(), $_POST["idn_key"]);

if($temp_prod == 'false') {
    $temp_prod = new temp_prod();
}

$temp_prod->setSessionId(session_id());
$temp_prod->setbase64Image($_POST["base64_image"]);
$temp_prod->setTitle($_POST["title"]);
$temp_prod->setCommentaire($_POST["comm"]);
$temp_prod->setOpt($_POST["option"]);
$temp_prod->setEscargot($_POST["escargot"]);
$temp_prod->setDimension($_POST["dimension"]);
$temp_prod->setQte($_POST["qte"]);
$temp_prod->setBonRepli($_POST["bonrepli"]);
$temp_prod->setPrix($_POST["prix"]);
$temp_prod->setIdnKey($_POST["idn_key"]);
$temp_prod->setData($_POST["data"]);

$temp_prod->save();

print_r($_SESSION);

