<?php
include_once 'include_all.php';

$mode = $_GET['mode'];
if($mode == 0) {
    $metier = new listmetier();
    $metier = $metier->rechercher();

    print json_encode($metier);
    return;
}
else if($mode == 1) {
    $metier = new listmetier();
    $metier->setLibelle($_GET["desig"]);
    $metier->setSubLibelle($_GET["sub_desig"]);
    $metier->setActive(1);
    $re= $metier->save();
    print $re;
    return;
}
else if($mode == 2) {
    $metier = new modelmetier();
    $metier = $metier->rechercher();
    print json_encode($metier);
    return;
}
else if($mode == 3) {
    $cata = new cata();
    $cata = $cata->findAllByMetier($_GET["metier"]);
    $row =[];
    foreach($cata as $ligcata){
        $cata_ligne = new cata_ligne();

        $cata_ligne = $cata_ligne->findByPrimaryKey($ligcata["id_front"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($ligcata["id_front"]);

        $arrFront = ["src"=>$cata_ligne->getSrc(),"title"=>$cata_ligne->getTitle(), "elements"=>$cata_ligne_params ];
        $ligcata["front"] = $arrFront;



        $cata_ligne = $cata_ligne->findByPrimaryKey($ligcata["id_back"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($ligcata["id_front"]);
        $arrBack = ["src"=>$cata_ligne->getSrc(),"title"=>$cata_ligne->getTitle(), "elements"=>$cata_ligne_params ];
        $ligcata["back"] = $arrBack;

        $row[] = $ligcata;
    }
print json_encode($row);
    return;
}
else if($mode == 4) {
    $listmetier = new listmetier();
    $listmetier->setLibelle(trim($_GET["libelle"]));
    $listmetier->setSubLibelle(trim($_GET["sub_libelle"]));
    $listmetier->setActive($_GET["actif"]);

    $listmetier->save();
}

else if($mode == 5){
    $listmetier  = new listmetier();
    $listmetier = $listmetier->findByPrimaryKey(trim($_GET["id"]));

    $listmetier->setId($listmetier->getId());
    $listmetier->setLibelle(trim($_GET["libelle"]));
    $listmetier->setSubLibelle(trim($_GET["sub_libelle"]));
    $listmetier->setActive($_GET["actif"]);

    $listmetier->save();
}

else if($mode == 6){
    $model = new modelmetier();
    $model = $model->findByPrimaryKey(trim($_GET["id"]));
    $model->setDescription(trim($_GET["name"]));
    $model->setQte($_GET["qte"]);
    $model->setActive($_GET["active"]);

    $model->save();
    print "done";
}
else if($mode == 7) {
    $model = new modelmetier_category();
    $model = $model->findByModel($_GET['id']);
    print json_encode($model);
}
else if($mode == 8) {
    $model = new modelmetier_category();
    $model->setDescription($_GET["description"]);
    $model->setIdModelMetier($_GET["id_modelmetier"]);
    $model->setSrc($_GET["src"]);
    $model->setQte($_GET["qte"]);
    $model->setActive($_GET["active"]);
    $model->save();

    $model = new modelmetier_category();
    $model = $model->findByModel($_GET['id_modelmetier']);
    print json_encode($model);
}
else if($mode == 9) {
    $metier = new modelmetier();
    $metier = $metier->rechModelCategory();
    print json_encode($metier);
    return;
}
else if($mode == 10){
    $instruction = new instructions();
    $instruction->setInstruction($_GET["text"]);
    $instruction->save();
}
else if($mode == 11) {
    $instruction = new instructions();
    $instruction = $instruction->rechercher();
    print json_encode($instruction);
}
else if($mode == 12) {
    $instruction = new instructions();
    $instruction = $instruction->findByPrimaryKey($_GET["id"]);
    $instruction->setInstruction($_GET["instruction"]);
    $instruction->save();
}
else if($mode == 13){
    $id_metier = $_GET["id"];
    $arrInfo = array();
    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->findByPrimaryKey($id_metier);
    $cataDimension = new cata();
    $cataDimension = $cataDimension->findDimsByModelMetier($id_metier);

    $arrInfo = array("qte" => $modelmetier->getQte());
    print json_encode($arrInfo);
}
else if($mode == 14) {
    $cataPapier = new cata_papier();
    $cataPapier->setDescription($_GET["description"]);
    $cataPapier->save();

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
}
else if($mode == 15){
    //recup tous les type de support
    $cataPapier = new cata_papier();
    $cataPapier = $cataPapier->rechercher();
    print json_encode($cataPapier);
}
else if ($mode == 16) {
    $cataPapier = new cata_papier();
    $cataPapier = $cataPapier->findByPrimaryKey($_GET["id"]);
    $cataPapier->setDescription($_GET["description"]);
    $cataPapier->save();

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
}
else if($mode == 17) {
    $cataPapier = new cata_papier();
    $cataPapier->delete($_GET["id"]);

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
}