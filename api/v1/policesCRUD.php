<?php
include_once 'include_all.php';

$mode = $_GET['mode'];

if ($mode == 0){
    $data = new polices();
    $data = $data->rechercher();
    print json_encode($data);
}
else if($mode == 1) {
    $nom = $_GET["nom"];
    $path = $_GET["path"];
    $police = new polices();
    $police->setNom($nom);
    $police->setPath($path);
    $police->setActive(1);
    $police->save();
}
else if($mode == 2) {
    $data = new polices();
    $data = $data->rechercher1();
    print json_encode($data);
}