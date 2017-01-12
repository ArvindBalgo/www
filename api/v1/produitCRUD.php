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