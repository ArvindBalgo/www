<?php
require_once 'classes/dbHandler.php';
include_once 'classes/include_all.php';
/*
*
* An example php that gets the 64 bit encoded PNG URL and creates an image of it
*
*/
$db = new DbHandler();
$session = $db->getSession();
//get the base-64 from data
$base64_str = substr($_POST['base64_image'], strpos($_POST['base64_image'], ",")+1);

//decode base64 string

$decoded = base64_decode($base64_str);
$strTime = strtotime('now').".png";
$png_url = "../images/client/product_".$strTime;
//create png from decoded base 64 string and save the image in the parent folder
$result = file_put_contents($png_url, $decoded);
$commande = new commande();
$commande->setTitle($_POST["titre"]);
$commande->setCommentaire($_POST["commentaire"]);
$commande->setSrc("images/flat_images/product_".$strTime);
$commande->setIdFront(0);
$commande->setIdBack(0);
$commande->setAddon($_POST["option"]);
$commande->setDimension($_POST["dimension"]);
$commande->setQuantite($_POST["qte"]);
$commande->setBonRepli($_POST["bonrepli"]);
$commande->setPrix(0);

$commande->setCreatedBy($session['uid']);
$commande->save();

$lastID = $commande->getLastId();

$commande = $commande->findByPrimaryKey($lastID);

$contents = $_POST["data"];
$count=0;
foreach($contents as $ligne){
    $commande_ligne = new commande_ligne();
    $commande_ligne->setSrc($ligne["thumbnail"]);
    $commande_ligne->setTitle($ligne["title"]);
    $commande_ligne->save();
    $last_id = $commande_ligne->getLastId();
    if($count == 0) {
        $commande->setIdFront($last_id);
        foreach($ligne['elements'] as $sub_ligne){
            $commande_ligne_params = new commande_ligne_params();
            $commande_ligne_params->setTitle($sub_ligne["title"]);
            $commande_ligne_params->setSrc($sub_ligne["source"]);
            $commande_ligne_params->setType($sub_ligne["type"]);
            $commande_ligne_params->setParams(serialize($sub_ligne["parameters"]));
            $commande_ligne_params->setIdCommLigne($last_id);
            $commande_ligne_params->save();
        }
    }
    else if(sizeof($contents) > 1){
        $commande->setIdBack($last_id);
        foreach($ligne['elements'] as $sub_ligne){
            $commande_ligne_params = new commande_ligne_params();
            $commande_ligne_params->setTitle($sub_ligne["title"]);
            $commande_ligne_params->setSrc($sub_ligne["source"]);
            $commande_ligne_params->setType($sub_ligne["type"]);
            $commande_ligne_params->setParams(serialize($sub_ligne["parameters"]));
            $commande_ligne_params->setIdCommLigne($last_id);
            $commande_ligne_params->save();
        }
    }
    $count++;
}

$commande->save();

//send result - the url of the png or 0
header('Content-Type: application/json');
header_remove('Set-Cookie');
if($result) {
    print "product_".$strTime;
    die();
	//$png_url = get_folder_url().$png_url;
	//echo ($png_url);
}
else {
	echo json_encode(0);
}

//returns the current folder URL
function get_folder_url() {
	$url = $_SERVER['REQUEST_URI']; //returns the current URL
	$parts = explode('/',$url);
	$dir = $_SERVER['SERVER_NAME'];
    $dir = "";
	for ($i = 0; $i < count($parts) - 1; $i++) {
		$dir .= $parts[$i] . "/";
	}
	//return 'http://'.$dir;
	return $dir;
}