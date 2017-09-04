<?php

include_once 'include_all.php';

$mode = $_GET['mode'];

if ($mode == 0){
    $id = $_GET["id"];
    $cata = new cata();
    $cata = $cata->findAllBySousCategory($id);
    print json_encode($cata);
}
else if($mode == 1) {
    $id = $_GET["id"];
    $cata = new cata();
    $cata->delete($id);

    $cataMetier = new cata_metier();
    $cataMetier->deleteIdCata($id);
    print "done";
}
else if($mode == 2) {
    $id = $_GET["id_cata"];
    $cata = new cata();
    $cata = $cata->findByPrimaryKey($id);
    $cata->setKeyDescription($_GET["key"]);
    $cata->save();
    print "done";
}
else if($mode == 3) {
    $pays = $_GET["pays"];
    $pub = new pub();
    $pub = $pub->findByPays($pays);


    if($pub == null) {
        print 'null';
        return;
    }
    $arrPub = array(
        "id"    =>  $pub->getId(),
        "actif" =>  $pub->getActif(),
        "link"  =>  $pub->getLink(),
        "pays"  =>  $pub->getPays()
    );
    print json_encode($arrPub);
}
