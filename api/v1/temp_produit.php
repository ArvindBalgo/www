<?php
include_once 'include_all.php';
include_once "../chromePHP.php";
if(!session_id()) {
    session_start();
}
$temp_prod = new temp_prod();
chromePHP::log($_POST['modified']);
chromePHP::log($_POST["idn_key"]);
if($_POST["modified"] || $_POST["modified"] == 'true') {
    $temp_prod = $temp_prod->findByComboKeyRandom($_POST["idn_key"], $_POST["random_str"]);
}
$temp_prod->setSessionId(session_id());
$temp_prod->setbase64Image($_POST["base64_image"]);
$temp_prod->setTitle($_POST["title"]);
$temp_prod->setCommentaire($_POST["comm"]);
$temp_prod->setOpt($_POST["opt"]);
$temp_prod->setEscargot($_POST["escargot"]);
$temp_prod->setEscargotVal($_POST["escargot_val"]);
$temp_prod->setContours($_POST["contours"]);
$temp_prod->setLiserai($_POST["liserai"]);
$temp_prod->setDimension($_POST["dimension"]);
$temp_prod->setQte($_POST["qte"]);
$temp_prod->setBonRepli($_POST["bonrepli"]);
$temp_prod->setPrix($_POST["prix"]);
$temp_prod->setUnitPrix($_POST["unitprix"]);
$temp_prod->setIdSupport($_POST["idsupport"]);
$temp_prod->setSupport($_POST["support"]);
$temp_prod->setIdnKey($_POST["idn_key"]);
$temp_prod->setIdModelMetier($_POST["idmodelmetier"]);
$temp_prod->setIdProduit($_POST["idproduit"]);
$temp_prod->setRandomStr($_POST["random_str"]);
$temp_prod->setData($_POST["data"]);
$temp_prod->setIdDimension($_POST["id_dimension"]);
$temp_prod->setIdQte($_POST["id_qte"]);

$temp_prod->save();

print_r("done");

