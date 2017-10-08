<?php
include_once 'include_all.php';

$mode = $_GET['mode'];

if ($mode == 0){
    $data = new polices();
    $data = $data->rechercher();
    print json_encode($data);
    $data=null;
}
else if($mode == 1) {
    $nom = $_GET["nom"];
    $path = $_GET["path"];
    $police = new polices();
    $police->setNom($nom);
    $police->setPath($path);
    $police->setActive(1);
    $police->save();
    $police=null;
}
else if($mode == 2) {
    $data = new polices();
    $data = $data->rechercher1();
    print json_encode($data);
    $data=null;
}
else if($mode == 3) {
    $id = $_GET["id"];
    $police = new polices();
    $police->delete($id);
    print "done";
    $police=null;
}
else if($mode = 4) {
    $id = $_GET["id"];
    $nom = $_GET["nom"];
    $police = new polices();
    $police = $police->findByPrimaryKey($id);
    $police->setNom($nom);
    $police->save();
    $police=null;
}