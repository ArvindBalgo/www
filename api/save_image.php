<?php
require_once 'classes/dbHandler.php';
include_once 'classes/dbConnect.php';
include_once 'classes/listmetier.php';
include_once 'classes/modelmetier.php';
include_once 'classes/gabarits.php';
include_once 'classes/sample.php';
include_once 'classes/cata.php';
include_once 'classes/cata_ligne.php';
include_once 'classes/cata_ligne_params.php';
include_once 'classes/cata_metier.php';
include_once 'classes/cata_image.php';
include_once 'classes/cata_category.php';
include_once 'classes/modelmetier_category.php';
include_once 'classes/instructions.php';
include_once 'classes/commande.php';
include_once 'classes/commande_ligne.php';
include_once 'classes/commande_ligne_params.php';
include_once 'classes/cata_papier.php';
include_once 'classes/cata_dimension.php';
include_once 'classes/cata_support.php';
include_once 'classes/docs.php';
include_once 'classes/apropos.php';
include_once 'classes/conditionvente.php';
include_once 'classes/legale.php';
include_once 'classes/utilisation.php';
include_once 'classes/coeff_prix.php';
include_once 'classes/souscategory_prix.php';
include_once 'classes/souscategory_coeffprix.php';
include_once 'classes/tarif_manuel.php';
include_once 'classes/langue.php';
include_once 'classes/pays.php';
include_once 'classes/instructions_al.php';
include_once 'classes/instructions_en.php';
include_once 'classes/instructions_es.php';
include_once 'classes/instructions_it.php';
include_once 'classes/apropos_al.php';
include_once 'classes/apropos_en.php';
include_once 'classes/apropos_es.php';
include_once 'classes/apropos_it.php';
include_once 'classes/docs_al.php';
include_once 'classes/docs_en.php';
include_once 'classes/docs_it.php';
include_once 'classes/docs_es.php';
include_once 'classes/conditionvente_al.php';
include_once 'classes/conditionvente_en.php';
include_once 'classes/conditionvente_es.php';
include_once 'classes/conditionvente_it.php';
include_once 'classes/pub.php';
include_once 'classes/temp_prod.php';
include_once 'classes/frais_livraison.php';
include_once 'classes/orders_main.php';
include_once 'classes/orders_details.php';
include_once 'classes/tva.php';
/*
*
* An example php that gets the 64 bit encoded PNG URL and creates an image of it
*
*/
$db = new DbHandler();
$session = $db->getSession();
//get the base-64 from data
$base64_str = substr($_POST['base64_image'], strpos($_POST['base64_image'], ",") + 1);

//decode base64 string

$decoded = base64_decode($base64_str);
$strTime = strtotime('now') . ".png";
$png_url = "../images/flat_images/product_" . $strTime;
//create png from decoded base 64 string and save the image in the parent folder
$result = file_put_contents($png_url, $decoded);
$cata = new cata();
$cata->setLibelle($_POST["libelle"]);
$cata->setDescription($_POST["description"]);
$cata->setSrc("images/flat_images/product_" . $strTime);
$cata->setIdFront(0);
$cata->setIdBack(0);
$cata->setReference($_POST["ref"]);
$cata->setDimensions($_POST["dimensions"]);
if ($_POST["escargot"] == 'true') {
    $cata->setEscargot(1);
} else {
    $cata->setEscargot(0);
}
if ($_POST["contours"] == 'true') {
    $cata->setContours(1);
} else {
    $cata->setContours(0);
}
if ($_POST["liserai"] == 'true') {
    $cata->setLiserai(1);
} else {
    $cata->setLiserai(0);
}
if ($_POST["coucher"] == 'true') {
    $cata->setCoucher(1);
} else {
    $cata->setCoucher(0);
}
if ($_POST["gabarit"] == 'true') {
    $cata->setGabarit(1);
} else {
    $cata->setGabarit(0);
}
$cata->setCreatedBy($session['uid']);
$cata->setModifiedBy($session['uid']);
$cata->setPays($_POST["pays"]);
$cata->save();

$lastID = $cata->getLastId();

$cata = $cata->findByPrimaryKey($lastID);

$souscategory = new modelmetier_category();
$souscategory = $souscategory->findByPrimaryKey($_POST["metiers"]);


//foreach($_POST["metiers"] as $ligne){
$cata_metier = new cata_metier();
$cata_metier->setId_Cata($lastID);
$cata_metier->setId_Metier($souscategory->getIdModelMetier());
$cata_metier->setIdModelMetier($_POST["metiers"]);
$cata_metier->setActive(1);
$cata_metier->save();
//}
$contents = $_POST["data"];
$count = 0;
foreach ($contents as $ligne) {
    $cata_ligne = new cata_ligne();
    $cata_ligne->setSrc($ligne["thumbnail"]);
    $cata_ligne->setTitle($ligne["title"]);
    $cata_ligne->save();
    $last_id = $cata_ligne->getLastId();
    if ($count == 0) {
        $cata->setIdFront($last_id);
        foreach ($ligne['elements'] as $sub_ligne) {
            $cata_ligne_params = new cata_ligne_params();
            $cata_ligne_params->setTitle($sub_ligne["title"]);
            $cata_ligne_params->setSrc($sub_ligne["source"]);
            $cata_ligne_params->setType($sub_ligne["type"]);
            $cata_ligne_params->setParams(serialize($sub_ligne["parameters"]));
            $cata_ligne_params->setIdCataLigne($last_id);
            $cata_ligne_params->save();
        }
    } else if (sizeof($contents) > 1) {
        $cata->setIdBack($last_id);
        foreach ($ligne['elements'] as $sub_ligne) {
            $cata_ligne_params = new cata_ligne_params();
            $cata_ligne_params->setTitle($sub_ligne["title"]);
            $cata_ligne_params->setSrc($sub_ligne["source"]);
            $cata_ligne_params->setType($sub_ligne["type"]);
            $cata_ligne_params->setParams(serialize($sub_ligne["parameters"]));
            $cata_ligne_params->setIdCataLigne($last_id);
            $cata_ligne_params->save();
        }
    }
    $count++;
}

$cata->save();

$cata_ligne_params = new cata_ligne_params();

//send result - the url of the png or 0
header('Content-Type: application/json');
header_remove('Set-Cookie');
if ($result) {
    print "product_" . $strTime;
    $cata_metier = null;
    $contents = null;
    $souscategory = null;
    $cata = null;

    die();
    //$png_url = get_folder_url().$png_url;
    //echo ($png_url);
} else {
    echo json_encode(0);
    $cata_metier = null;
    $contents = null;
    $souscategory = null;
    $cata = null;
}

//returns the current folder URL
function get_folder_url()
{
    $url = $_SERVER['REQUEST_URI']; //returns the current URL
    $parts = explode('/', $url);
    $dir = $_SERVER['SERVER_NAME'];
    $dir = "";
    for ($i = 0; $i < count($parts) - 1; $i++) {
        $dir .= $parts[$i] . "/";
    }
    //return 'http://'.$dir;
    return $dir;
}